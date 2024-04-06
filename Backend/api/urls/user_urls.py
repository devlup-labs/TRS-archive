from django.urls import path
from api.views import user_views as views
# from rest_framework_simplejwt.views import (
#     TokenRefreshView,
# )


urlpatterns=[
    path("token/" ,views.MyTokenObtainPairView.as_view()),    
    path('token/refresh/',views.TokenRefreshView),
    path('send_email/',views.send_activation_email),
    path('verify/',views.verify_user),
    path('register/',views.registerUser),
    # path('verify/', views.VerifyOTP.as_view()),
    path('profile/',views.getUserProfile,name='user-profile'),
    path('profile/update/',views.updateUserProfile, name='edit_profile'),
    path('change_password/<int:u_id>/', views.change_password.as_view()),
    path('password_reset/',views.send_email_pass.as_view()),
]
