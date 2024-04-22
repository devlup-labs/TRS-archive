from django.urls import path
from api.views import review_views as views

urlpatterns=[
    path('reviews/<post_id>/', views.ReviewListView.as_view()),
    path('reviews/<post_id>/update/', views.ReviewListView.as_view()),
    path('reviews/<post_id>/add/', views.ReviewListView.as_view()),
]