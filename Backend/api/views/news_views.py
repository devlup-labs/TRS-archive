from ..models import *
from rest_framework.generics import CreateAPIView, GenericAPIView, ListAPIView, mixins, RetrieveAPIView
from api.serializer import *
from rest_framework.permissions import IsAuthenticated


class NewsListView(ListAPIView):
    queryset = New.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAuthenticated]
