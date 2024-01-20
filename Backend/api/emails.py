from django.core.mail import send_mail
import random
from django.conf import settings
from .models import User

def send_otp_via_email(email):
    subject='Your OTP for registering on TRS web'
    otp=random.randint(1000,9999)
    message=f'Here is your {otp}, keep exploaring!! '
    email_from=settings.EMAIL_HOST
    send_mail(subject,message,email_from,[email])
    user_obj=User.objects.get(email=email)
    user_obj.otp=otp #updating the otp attribute of the user 
    user_obj.save()