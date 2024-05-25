
from rest_framework.generics import CreateAPIView, GenericAPIView, ListAPIView, mixins, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from ..models import Category, SubCategory
from api.serializer import CategorySerializer, SubCategorySerializer
from rest_framework.mixins import ListModelMixin

class PostCategoryViewSet(mixins.CreateModelMixin, GenericAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

class PostSubCategoryViewSet(mixins.CreateModelMixin, GenericAPIView):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class RetrieveCategoryViewSet(ListModelMixin, GenericAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        data = []
        counter = 0
        for category in queryset:
            category_data = serializer.data[counter]
            subcategories = SubCategory.objects.filter(category_id=category.pk)
            subcategory_serializer = SubCategorySerializer(subcategories, many=True)
            category_data['subcategories'] = subcategory_serializer.data
            data.append(category_data)
            counter += 1
        return Response(data)
    
class RetrieveSubCategoryViewSet(GenericAPIView, ListModelMixin):
    serializer_class = SubCategorySerializer
    queryset = SubCategory.objects.all()
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        category_name = request.data['category']
        if category_name is None:
            return Response("Category must be provided", status=400)
        if not Category.objects.filter(name=category_name).exists():
            return Response("Invalid category provided", status=400)
        category = Category.objects.get(name=category_name)
        subcategories = SubCategory.objects.filter(category_id=category.pk)
        serializer = self.get_serializer(subcategories, many=True)
        return Response(serializer.data)

