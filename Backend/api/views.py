from rest_framework.decorators import api_view,permission_classes
from django.shortcuts import render
from api.models import Profile,User
from api.serializer import UserSerializer,MyTokenObtainPairSerializer,RegisterSerializer

from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
# Define RegisterView as a class-based view with generics.CreateAPIView
class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# Apply permission globally for the function-based view
    
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])  # Apply permission globally for the function-based view
def dashboard(request):
    if request.method == 'GET':
        context = f"Hey {request.user} you're seeing a GET response"
        return Response({'response': context}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        text = request.data.get('text')  # Use request.data instead of request.POST for JSON payloads
        response = f"Hey {request.user} your text is {text}"
        return Response({'response': response}, status=status.HTTP_200_OK)
    return Response({}, status=status.HTTP_400_BAD_REQUEST)



# Create your views here.
