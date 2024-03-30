from django.urls import path
from api.views import news_views as views



urlpatterns=[
    path('news/', views.NewsListView.as_view(), name='news-list'),
]