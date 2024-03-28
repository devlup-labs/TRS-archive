from django.urls import path
from api.views import post_views as views

urlpatterns=[
    path('<int:post_id>',views.AllCommentsViewSet.as_view()),
    path('<int:post_id>/comment/<int:comment_id>',views.DestroyCommentViewSet.as_view()),
    path('<int:post_id>/comment/',views.CreateCommentViewSet.as_view()),
    path('reviews/', views.ReviewListView.as_view(), name='review-list'),  
    path('upload/',views.PostViewSet.as_view()),

]