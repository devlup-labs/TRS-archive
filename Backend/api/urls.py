from rest_framework_simplejwt.views import (
    TokenRefreshView,
)
from django.urls import path
from .views import *
    
urlpatterns=[
    path("token/" ,MyTokenObtainPairView.as_view()),
    path('token/refresh',TokenRefreshView.as_view()),
    path('register/',RegisterView.as_view()),
    path('dashboard/',dashboard),
    path('verify/', VerifyOTP.as_view()),
    path('send-otp/',sendOtp.as_view())
]