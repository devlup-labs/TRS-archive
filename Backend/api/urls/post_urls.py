from django.urls import path
from api.views import post_views as views

urlpatterns=[
    path('<int:post_id>',views.AllCommentsViewSet.as_view()),
    path('<int:post_id>/comment/<int:comment_id>',views.DestroyCommentViewSet.as_view()),
    path('<int:post_id>/comment/',views.CreateCommentViewSet.as_view()),
    path('allpost/', views.PostViewSet.as_view(), name='post-list'),  # For all posts
    path('allpost/<str:curr_status>/',views.PostViewSet.as_view()),
    path('getpost/:<uuid:post_id>/',views.getParticularPost),
    path('updatepost/<uuid:post_id>/',views.updateParticularPost),

    path('<user_id>/posts/',views.ParticularUserPost.as_view()),
    path('<user_id>/posts/<post_id>',views.singlepostfromparticularuser.as_view()),
    path('<user_id>/posts/<post_id>/update/',views.ParticularUserPost.as_view()),
    path('<user_id>/posts/<post_id>/delete/',views.ParticularUserPost.as_view()),
    path('upload/',views.PostViewSet.as_view()),

    

]