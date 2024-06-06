from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser
import uuid,random,datetime

Roles_Choices = (
        ('admin', 'Admin'),
        ('editor', 'Editor'),
        ('normal_user', 'Normal_User'),
        ('reviewer', 'Manuscript_Reviewer'),
        ('developer','Web_developer'),
    )

Categories_Choices=(
    ('robotics','Robotics'),
    ('manufacturing','Manufacturing'),
    ('drone','Drone'),
    ('manipulator','Manipulator'),
    ('humanoids','Humanoids'),

)

Status_Choices=(

    ('Ongoing','Ongoing'),
    ('Under_Review','Under_Review'),
    ('Need_changes','Need_changes'),
    ('Reviewed','Reviewed'),
)

class Institute(models.Model):
    college_name = models.CharField(max_length=100)
    email_tag = models.CharField(max_length=50)  # e.g., @iitk.ac.in
    is_approved=models.BooleanField(default=False)


    def __str__(self):
        return self.college_name
    
class Category(models.Model):
    name = models.CharField(max_length=100,null=True)
    def __str__(self):
        return self.name

class SubCategory(models.Model):
    name = models.CharField(max_length=100,null=True)
    category = models.ForeignKey(Category,on_delete=models.CASCADE)
    description = models.TextField(null=True)
    def __str__(self):
        return self.name
    
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    is_verified=models.BooleanField(default=False)
    area_of_research=models.CharField(max_length=200,null=True,blank=True)#needs to be made reqd
    affiliation = models.CharField(max_length=100, null=True, blank=True)
    default_category=models.ForeignKey(Category,on_delete=models.SET_NULL,null=True,blank=True)
    current_position=models.CharField(max_length=100,blank=True,null=True)
    roles=models.CharField(max_length=20, choices=Roles_Choices,blank=True,null=True,default='normal_user')
    otp=models.CharField(max_length=4,null=True,blank=True)
    full_name = models.CharField(max_length=1000,null=True,blank=True)
    bio = models.CharField(max_length=100,null=True,blank=True)
    image = models.ImageField(upload_to="user_images", default="default.jpg")
    
    upload_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        if not self.affiliation:
            # Extract domain from email
            email_domain = self.email.split('@')[-1]
            try:
                # Try to find the corresponding institute based on email tag
                institute = Institute.objects.get(email_tag='@' + email_domain)
                self.affiliation = institute.college_name
                self.upload_verified=institute.is_approved
            except Institute.DoesNotExist:
                pass  # Do nothing if the institute doesn't exist
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.username

class Activation(models.Model):
    email=models.EmailField(unique=True,primary_key=True)
    activation_key=models.UUIDField(editable=True)
    is_verified=models.BooleanField(default=False)



class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    title = models.CharField(max_length=100)
    body = models.TextField()
    status = models.CharField(max_length=20, choices=Status_Choices, default='Ongoing')
    category = models.CharField(max_length=100)
    sub_category = models.CharField(max_length=100)
    document = models.FileField(upload_to='uploads/')
    created_at = models.DateTimeField(auto_now_add=True)
    



class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.TextField()
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    description = models.TextField()
    pdf_file_status = models.CharField(max_length=20, choices=Status_Choices, default='Ongoing')  
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE)
    editor = models.ForeignKey(User, on_delete=models.CASCADE,related_name='editor',null=True,blank=True)
    is_reviewed = models.BooleanField(default=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)
    reviewed_pdf = models.FileField(upload_to='uploads/',null=True,blank=True)
    for_user = models.BooleanField(default=False)

class New(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='news_images/')
