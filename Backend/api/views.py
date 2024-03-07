from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, get_object_or_404
from api.models import User, Post, Comment, New, Review
from api.serializer import UserSerializer, MyTokenObtainPairSerializer, RegisterSerializer, NewsSerializer, ReviewSerializer

from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework import status,generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.serializer import *
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
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import jwt,json
from .models import *

from django.core.mail import send_mail


class AllCommentsViewSet(mixins.ListModelMixin, GenericAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSeralizer

    def get(self, request, post_id, *args, **kwargs):
        comments = Comment.objects.filter(post=post_id)
        serializer = self.serializer_class(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class DestroyCommentViewSet(GenericAPIView, mixins.RetrieveModelMixin, mixins.DestroyModelMixin):
    queryset = Comment.objects.all()
    serializer_class = CommentSeralizer
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id, comment_id=None, *args, **kwargs):
        comments = Comment.objects.filter(post_id=post_id).filter(id=comment_id)
        serializer = self.serializer_class(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, post_id, comment_id, *args, **kwargs):
        user = request.user
        comment = get_object_or_404(Comment, id=comment_id, post_id=post_id)
        if user != comment.user:
            return Response("You are not authorized to delete this comment", status=status.HTTP_401_UNAUTHORIZED)
        comment.delete()
        return Response("Comment deleted successfully", status=status.HTTP_200_OK)

class CreateCommentViewSet(GenericAPIView, mixins.CreateModelMixin):
    queryset = Comment.objects.all()
    serializer_class = CommentSeralizer
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id, *args, **kwargs):
        user = request.user
        try:
            comment = Comment.objects.create(
                user=user,
                post_id=post_id,
                body=request.data.get('body'),
                created_at=datetime.datetime.now()
            )
            comment.save()  
        except IntegrityError as e:
            return Response("IntegrityError: {}".format(str(e)), status=status.HTTP_400_BAD_REQUEST)
        return Response("Comment created successfully", status=status.HTTP_201_CREATED)
    
class PostViewSet(GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        posts = Post.objects.all()
        serializer = self.serializer_class(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK) 

    def post(self, request, *args, **kwargs):
        self.permission_classes = [IsAuthenticated]
        file_uploaded = request.FILES.get('document')

        if file_uploaded is None:
            return Response("FILE is missing", status=status.HTTP_400_BAD_REQUEST)
    
        user = request.user 

        try:
            post = Post.objects.create(
                user=user,
                # id=request.data.get('id'),
                title=request.data.get('title'),
                body=request.data.get('body'),
                category=request.data.get('category'),
                sub_category=request.data.get('sub_category'),
                document=file_uploaded,
                created_at=datetime.datetime.now()
            )
            post.save()  # Save the post object to the database
        except IntegrityError as e:
            return Response("IntegrityError: {}".format(str(e)), status=status.HTTP_400_BAD_REQUEST)
        return Response("File uploaded successfully", status=status.HTTP_201_CREATED)


class NewsListView(generics.ListAPIView):
    queryset = New.objects.all()
    serializer_class = NewsSerializer
    permission_classes = [IsAuthenticated]

class ReviewListView(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]


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
            print(e)
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
        


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def edit_profile(request):
    if request.method == 'GET':
        context = f"Hey {request.user.username} you're seeing a GET response and {request.user.email} "
        return Response({'response': context}, status=status.HTTP_200_OK)


    if request.method == 'POST':
        # Check if the Authorization header is present


        # response_data = {
            # 'message': 'Token extracted successfully',
            # 'token': token
        # }

        # return JsonResponse(response_data, status=200)

        try:
            # Decode the JWT token to extract user information
            

            # Get the user profile based on the user ID
           

            # Extract data from the request body
            data = request.data

            # Update user profile fields
            request.user.username=data.get('username',request.user.username)
            request.user.email = data.get('email', request.user.email)
            # Update other fields as needed

            # Save the updated user profile
            request.user.save()
            response = f"Hey {request.user.username} your text is {request.user.email}"
            return Response({'response': response}, status=status.HTTP_200_OK)
            return JsonResponse({'message': 'Profile updated successfully'}, status=200)

        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': 'Expired token'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User profile not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



class send_email(APIView):
    def post(self,request):
        try:
            data=request.data
            email=data.get('email')
            print(email)

            verify=User.objects.filter(email=email).first()
            if verify:
                link=f'http://localhost:5173/change_pass/{verify.id}'
                send_mail(
                'Reset Password for TRS_website ',
                "We've received a request to reset your password. Please click on the link below to reset your password:" + link,
                
                'your_email@example.com',
                [email],
                fail_silently=False,
                
            )
                print("Email sent successfully")
                return JsonResponse({'bool':True,'msg':'Please Check your email'})
            else:
                print("error")
                return JsonResponse({'bool':False,'msg':"User with this email doesn't exist"})
            
        except Exception as e:
            print(e)
            return Response({
                'status': 500,
                'message': f'Error: {str(e)}',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



    



class change_password(APIView):
    def post(self,request,u_id):
        try:
            data=request.data
            password=data.get('password')
            verify=User.objects.filter(id=u_id).first()
            if verify:
                verify.set_password(password)
                verify.save()

                return JsonResponse({'bool':True,'msg':'Password has been changed'})
            else:
                return JsonResponse({'bool':False,'msg':'Some error has occured'})
        
        except Exception as e:
            print(e)
            return Response({
                'status': 500,
                'message': f'Error: {str(e)}',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

