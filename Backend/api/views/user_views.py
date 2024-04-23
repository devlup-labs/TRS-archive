from rest_framework.decorators import api_view, permission_classes
from api.models import User
from api.serializer import UserSerializer,  RegisterSerializer, NewsSerializer, ReviewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework import status,generics
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from rest_framework.response import Response

from api.serializer import *
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView, ListAPIView, mixins, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from ..emails import *
from rest_framework.viewsets import ViewSet
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import jwt,json
from ..models import *
from django.contrib.auth.hashers import make_password

from django.core.mail import send_mail





class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        serializer = UserSerializerWithToken(user)
        data.update(serializer.data)

        return data
    def get_token(self, user):
        return super().get_token(user)

class MyTokenObtainPairView(APIView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)


    
# Define RegisterView as a class-based view with generics.CreateAPIView
# class RegisterView(CreateAPIView):
#     queryset = User.objects.all()
#     permission_classes = (AllowAny,)
#     serializer_class = RegisterSerializer
    

@api_view(['POST'])
def registerUser(request):
    try:
        data=request.data

        if User.objects.filter(email=data['email']).exists():  # Check if user with this email already exists
            raise ValueError('User with this email already exists')

        user=User.objects.create(
            username=data['username'],
            email=data['email'],
            password=make_password(data['password']),  #to hash password


        )
        serializer=UserSerializer(user,many=False)


        return Response(serializer.data)
    except Exception as e:
        message = {'detail': str(e)}  # Return specific error message
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def profileSetup(request):
    try:
        data=request.data
        email=data['email']
        user=User.objects.get(email=email)
        user.full_name=data['fullname']
        user.area_of_research=data['aor']
        # if data['affil']:
        #     user.affiliation=data['affil']
        user.current_position=data['cp']
        category_name=data['cat']
        if category_name:
            try:
                category=Category.objects.get(name=category_name)
                user.default_category=category
            except  Exception as e:
                message={"detail":str(e)}
        user.save()
        
        serializer=UserSerializer(user,many=False)


        return Response(serializer.data)
    except Exception as e:
        message={'detail':str(e)}
        return Response(message,status=status.HTTP_400_BAD_REQUEST)


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
            return Response({
                'status': 500,
                'message': f'Error: {str(e)}',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TokenRefreshView(GenericAPIView, mixins.CreateModelMixin):
    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get('refresh')
        if refresh_token:
            try:
                refresh_token_obj = RefreshToken(refresh_token)
                # Update the user's access token (you can also add more data to the token here)
                new_access_token = str(refresh_token_obj.access_token)
                
                return Response(new_access_token)
            
            except Exception as e:
                return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)     






class send_email_pass(APIView):
    def post(self,request):
        try:
            data=request.data
            email=data.get('email')

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
                return JsonResponse({'bool':True,'msg':'Please Check your email'})
            else:
                return JsonResponse({'bool':False,'msg':"User with this email doesn't exist"})
            
        except Exception as e:
            return Response({
                'status': 500,
                'message': f'Error: {str(e)}',
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user=request.user
    serializer=UserSerializer(user,many=False) #as one user request
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user=request.user
   
    
    data=request.data
    user.username=data['name']
    user.email=data['email']
    user.area_of_research=data['aor']
    # user.default_category=data['category']
    user.current_position=data['current_postn']
    user.roles=data['roles']

    user.save()
    serializer=UserSerializerWithToken(user) #token used as it needs to be updated as information changes
    response_data = serializer.data

    refresh_token = RefreshToken.for_user(user)
    response_data['access'] = str(refresh_token.access_token)
    response_data['refresh'] = str(refresh_token)


    return Response(response_data)


@api_view(['POST'])
def send_activation_email(request):
   
    # Assuming you have a form with 'email' field for registration
    email = request.data['email']

    
    # Check if the email is already registered
    if User.objects.filter(email=email).exists():
        return JsonResponse({'error': 'Email already exists'}, status=400)
        # Generate activation key (you can use any method to generate a unique key)
    activation_key = generate_activation_key()

    # Save the activation key along with the user's email in your database
    save_activation_key(email, activation_key)

    # Send activation email
    send_activation_email_to_user(email, activation_key)

    return JsonResponse({'success': 'Activation email sent'}, status=200)
    

def generate_activation_key():
    import uuid
    return str(uuid.uuid4())

def save_activation_key(email, activation_key):
#     # Save the activation key along with the user's email in your database
#     # You can use your preferred method for saving data to the database
#     # Example: creating a model for storing activation keys
    activation = Activation.objects.create(
                        email=email, 
                        activation_key=activation_key
                )

    activation.save()

def send_activation_email_to_user(email, activation_key):
    # Send activation email to the user
    subject = 'Verify your email_id'
    activation_link = f'http://localhost:5173/activate/{activation_key}'  # Replace 'yourwebsite.com' with your actual website domain
    message = f'Click the link below to complete your verification: <a href="{activation_link}">{activation_link}</a>'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list, html_message=message)

@api_view(['POST'])
def verify_user(request):

    activation_key=request.data['key']
    try:
        # Find the user with the given activation key
        activation = Activation.objects.get(activation_key=activation_key)
        email=activation.email
        # Mark the user's email as verified
        activation.is_verified = True
        activation.save()

        return JsonResponse({'message': 'Email verified successfully','email':email}, status=200)
    except User.DoesNotExist:
        return JsonResponse({'error': 'Invalid activation key'}, status=400)
    

@api_view(['POST'])
# @permission_classes([IsAuthenticated])
def TokenRefreshView(request):


    refresh_token = request.data['refresh']
    if refresh_token:
        try:
            refresh_token_obj = RefreshToken(refresh_token)
            
            # Update the user's access token (you can also add more data to the token here)
            new_access_token = str(refresh_token_obj.access_token)
            
           
            return Response(new_access_token)
        
        except Exception as e:
            return Response({'error': 'Invalid refresh token'}, status=400)
    else:
        return Response({'error': 'Refresh token is required'}, status=400)
    

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    try:
        users=User.objects.all()
        serializer=AllUserSerializer(users,many=True)
        return Response(serializer.data)    
    except Exception as e:
        message = {'detail': str(e)}  # Return specific error message
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getCategories(request):
    try:
        categories=Category.objects.all()
        serializers=CategorySerializer(categories,many=True)
        return Response(serializers.data)
    except Exception as e:
        message = {'detail': str(e)}  # Return specific error message
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
# user_views