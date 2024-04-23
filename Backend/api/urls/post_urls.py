from django.urls import path
from api.views import post_views as views

urlpatterns=[
    path('<int:post_id>',views.AllCommentsViewSet.as_view()),
    path('<int:post_id>/comment/<int:comment_id>',views.DestroyCommentViewSet.as_view()),
    path('<int:post_id>/comment/',views.CreateCommentViewSet.as_view()),
    path('reviews/', views.ReviewListView.as_view(), name='review-list'),  
    path('allupload/',views.PostViewSet.as_view()),
    path('<user_id>/posts/',views.ParticularUserPost.as_view()),
    path('<user_id>/posts/<post_id>',views.singlepostfromparticularuser.as_view()),
    path('<user_id>/posts/<post_id>/update/',views.ParticularUserPost.as_view()),
    path('<user_id>/posts/<post_id>/delete/',views.ParticularUserPost.as_view()),
    path('upload/',views.PostViewSet.as_view()),
]