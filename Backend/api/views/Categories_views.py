
from rest_framework.generics import CreateAPIView, GenericAPIView, ListAPIView, mixins, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from ..models import Category, SubCategory
from api.serializer import CategorySerializer, SubCategorySerializer
from rest_framework.mixins import ListModelMixin
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status


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

    def post(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        category_name = request.data.get('cat')
        print(category_name)
        if category_name is None:
            return Response("Category must be provided", status=400)
        if not Category.objects.filter(name=category_name).exists():
            return Response("Invalid category provided", status=400)
        category = Category.objects.get(name=category_name)
        subcategories = SubCategory.objects.filter(category_id=category.pk)
        serializer = self.get_serializer(subcategories, many=True)
        return Response(serializer.data)
    

@api_view(['GET'])
def getCategories(request):
    try:
        categories=Category.objects.all()
        serializers=CategorySerializer(categories,many=True)
        return Response(serializers.data)
    except Exception as e:
        message = {'detail': str(e)}  # Return specific error message
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    

