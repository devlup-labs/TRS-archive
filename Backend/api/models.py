from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    is_verified=models.BooleanField(default=False)
    otp=models.CharField(max_length=4,null=True,blank=True)
    full_name = models.CharField(max_length=1000,null=True,blank=True)
    bio = models.CharField(max_length=100,null=True,blank=True)
    image = models.ImageField(upload_to="user_images", default="default.jpg")
    upload_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
            college_domains = ['iit']
            for domain in college_domains:
                if domain in self.email:  # Check if the email contains '.iit'
                    print(f"Email contains '{domain}': {self.email}")
                    self.upload_verified = True # Set upload_verified to True
                    break  
                else:
                    print(f"Email does not contain '{domain}'")
            super().save(*args, **kwargs)


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    title = models.CharField(max_length=100)
    body = models.TextField()
    status = models.BooleanField(default=False)
    category = models.CharField(max_length=100)
    sub_category = models.CharField(max_length=100)
    document = models.FileField(upload_to='uploads/')
    created_at = models.DateTimeField(auto_now_add=True)