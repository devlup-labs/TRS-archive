from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render
from api.models import User, Posts
from api.serializer import UserSerializer, MyTokenObtainPairSerializer, RegisterSerializer

from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.serializer import UserSerializer, MyTokenObtainPairSerializer, RegisterSerializer, VerifyAccountSerializer, OTPVerificationSerializer, PostsSerializer
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView, ListAPIView, mixins, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .emails import *
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet
import os
from django.conf import settings
import datetime
from rest_framework.parsers import MultiPartParser, FormParser
from django.db import IntegrityError



class PostsViewSet(GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Posts.objects.all()
    serializer_class = PostsSerializer
    permission_classes = [IsAuthenticated]

    
    def get(self, request, *args, **kwargs):
        posts = Posts.objects.all()
        serializer = self.serializer_class(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 

    def post(self, request, *args, **kwargs):
        file_uploaded = request.FILES.get('file_uploaded')

        
        if file_uploaded is None:
            return Response("FILE is missing", status=400)
        
        user = request.user 

        try:
            Posts.objects.create(user=user, document=file_uploaded, created_at=datetime.datetime.now())
        except IntegrityError as e:
            return Response("IntegrityError: {}".format(str(e)), status=status.HTTP_400_BAD_REQUEST)


        # Posts.objects.create(document=file_uploaded, created_at= datetime.datetime.now())

        file_path = os.path.join(settings.MEDIA_ROOT, file_uploaded.name)
        with open(file_path, 'wb') as dt:
            for content in file_uploaded.chunks():
                dt.write(content)
        return Response("File uploaded successfully", status=201)


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


class sendOtp(APIView):

    def post(self, request):
        try:
            data = request.data
            email = data.get('email')
            if not email:
                return Response({
                    'status': 400,
                    'message': 'Email not provided',
                }, status=status.HTTP_400_BAD_REQUEST)

            # Call the send_otp_via_email function
            send_otp_via_email(email)

            return Response({
                'status': 200,
                'message': 'OTP sent successfully',
            })

        except Exception as e:
            return Response({
                'status': 500,
                'message': f'Error: {str(e)}',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class VerifyOTP(APIView):
    def post(self, request):
        try:
            data = request.data
            print("aditya")
            serializer = VerifyAccountSerializer(data=data)
            
            if serializer.is_valid():
                email = serializer.data['email']
                otp = serializer.data['otp']

                user = User.objects.filter(email=email, otp=otp, is_verified=False).first()

                if user:
                    user.is_verified = True
                    user.save()
                    return Response({
                        'status': 200,
                        'message': 'OTP verified successfully.',
                        'data': {},
                    })
                else:
                    return Response({
                        'status': 400,
                        'message': 'Invalid OTP or user already verified.',
                        'data': serializer.data,
                    })

            return Response({
                'status': 600,
                'message': 'Invalid data',
                'data': serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'status': 500,
                'message': f'Error: {str(e)}',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
