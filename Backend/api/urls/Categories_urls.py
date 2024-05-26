from django.urls import path
from api.views.Categories_views import PostCategoryViewSet , RetrieveCategoryViewSet, PostSubCategoryViewSet, RetrieveSubCategoryViewSet
from api.views import Categories_views as views


urlpatterns=[
    path('create/category',PostCategoryViewSet.as_view()),
    path('retrieve/',RetrieveCategoryViewSet.as_view()),
    path('create/subcategory',PostSubCategoryViewSet.as_view()),
    path('getCategories/',views.getCategories),
    path('getSubCat/',RetrieveSubCategoryViewSet.as_view()),
]   