from rest_framework.decorators import api_view, permission_classes
from api.models import User
from api.serializer import UserSerializer,  RegisterSerializer, NewsSerializer, ReviewSerializer
from rest_framework_simplejwt.views import TokenObtainPairView 
from rest_framework import status,generics
from rest_framework.permissions import AllowAny, IsAuthenticated
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