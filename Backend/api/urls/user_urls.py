from django.urls import path
from api.views import user_views as views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns=[
    path("token/" ,views.MyTokenObtainPairView.as_view()),    
    path('token/refresh',TokenRefreshView.as_view()),
    path('register/',views.RegisterView.as_view()),
    path('dashboard/',views.dashboard),
    path('verify/', views.VerifyOTP.as_view()),
    path('send-otp/',views.sendOtp.as_view()),
    path('profile/',views.getUserProfile,name='user-profile'),
    path('profile/update/',views.updateUserProfile, name='edit_profile'),
    path('change_password/<int:u_id>/', views.change_password.as_view()),
    path('password_reset/',views.send_email.as_view()),
]
