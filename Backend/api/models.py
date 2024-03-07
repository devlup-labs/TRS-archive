from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser
import uuid,random

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

    ('ongoing','Ongoing'),
    ('need_changes','Changes_Reqd'),
    ('reviewed','Reviewed'),
)

class Institute(models.Model):
    college_name = models.CharField(max_length=100)
    email_tag = models.CharField(max_length=50)  # e.g., @iitk.ac.in
    is_approved=models.BooleanField(default=False)


    def __str__(self):
        return self.college_name
    
class Category(models.Model):
    name=models.CharField(max_length=100, choices=Categories_Choices,null=True)
    sub_categories=models.CharField(max_length=100,null=True,blank=True)
    description=models.CharField(max_length=300,null=True,blank=True)

    def __str__(self):
        return self.name
class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    is_verified=models.BooleanField(default=False)
    area_of_research=models.CharField(max_length=200,null=True,blank=True)#needs to be made reqd
    affiliation=models.ForeignKey(Institute, on_delete=models.SET_NULL, null=True)
    default_category=models.ForeignKey(Category,on_delete=models.SET_NULL,null=True)
    current_position=models.CharField(max_length=100,blank=True,null=True)
    roles=models.CharField(max_length=20, choices=Roles_Choices,blank=True,null=True)
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
                self.affiliation = institute
                self.upload_verified=self.affiliation.is_approved
            except Institute.DoesNotExist:
                pass  # Do nothing if the institute doesn't exist
        super().save(*args, **kwargs)
            


class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    title = models.CharField(max_length=100)
    body = models.TextField()
    status = models.BooleanField(default=False)
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
    description = models.TextField()
    pdf_file_status = models.CharField(max_length=20, choices=Status_Choices, default='Ongoing')  
    reviewer_id = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)

class New(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='news_images/')