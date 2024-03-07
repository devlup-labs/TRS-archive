from rest_framework_simplejwt.views import (
    TokenRefreshView,
    
)
from django.urls import path,include
from .views import *
    
urlpatterns=[
    path("token/" ,MyTokenObtainPairView.as_view()),    
    path('token/refresh',TokenRefreshView.as_view()),
    path('register/',RegisterView.as_view()),
    path('dashboard/',dashboard),
    path('verify/', VerifyOTP.as_view()),
    path('send-otp/',sendOtp.as_view()),
    path('upload/',PostViewSet.as_view()),
    path('profile/edit/',edit_profile, name='edit_profile'),
    path('post/<int:post_id>',AllCommentsViewSet.as_view()),
    path('post/<int:post_id>/comment/<int:comment_id>',DestroyCommentViewSet.as_view()),
    path('post/<int:post_id>/comment/',CreateCommentViewSet.as_view()),
    path('change_password/<int:u_id>/', change_password.as_view()),
    path('password_reset/',send_email.as_view()),
    path('news/', NewsListView.as_view(), name='news-list'),
    path('reviews/', ReviewListView.as_view(), name='review-list'),    
    # path('token_det/',token_details,name="token_det"),
]