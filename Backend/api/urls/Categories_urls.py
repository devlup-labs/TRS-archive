from django.urls import path
from api.views.Categories_views import PostCategoryViewSet , RetrieveCategoryViewSet, PostSubCategoryViewSet



urlpatterns=[
    path('create/category',PostCategoryViewSet.as_view()),
    path('retrieve/',RetrieveCategoryViewSet.as_view()),
    path('create/subcategory',PostSubCategoryViewSet.as_view()),
]