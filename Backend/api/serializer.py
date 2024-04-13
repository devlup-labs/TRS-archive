from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework.serializers import Serializer, FileField
from .models import Post, Comment, User, Institute, Category, New, Review,SubCategory
from rest_framework_simplejwt.tokens import RefreshToken




class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','username','full_name','email','area_of_research','affiliation','default_category','current_position','roles','image','upload_verified']


class UserSerializerWithToken(UserSerializer):
    access = serializers.CharField(source='access_token', read_only=True)
    refresh = serializers.CharField(source='refresh_token', read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username','full_name', 'email', 'area_of_research', 'affiliation', 'default_category', 'current_position', 'roles', 'image', 'upload_verified', 'access', 'refresh', 'is_staff']


class AllUserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=['email','username','affiliation','is_staff']
    



class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    file_uploaded = serializers.FileField(write_only=True)

    class Meta:
        model = Post
        fields = '__all__' 


class CommentSeralizer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = ['user', 'post', 'likes', 'body', 'created_at']

        
# class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod    
#     def get_token(cls, user):
#         token = super().get_token(user)
        
#         #Adding custom claims
#         token['full_name'] = user.full_name
#         token['username'] = user.username
#         token['email'] = user.email
#         token['bio'] = user.bio
#         token['roles']=user.roles
#         token['affiliation']=user.roles
#         token['image'] = str(user.image)
#         token['is_verified'] = user.upload_verified
#         token['upload_verified'] = user.upload_verified
#         # ...
#         return token


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})

        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']

        )

        user.set_password(validated_data['password'])
        user.save()

        return user
    
class VerifyAccountSerializer(serializers.Serializer):
    email=serializers.EmailField()
    otp=serializers.CharField()

    
class OTPVerificationSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6, min_length=6, write_only=True)

    def validate_otp(self, value):
        user = self.context['request'].user

        if user.otp != value:
            raise serializers.ValidationError('Invalid OTP.')

        return value
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class ResetPasswordEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)



class NewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = New
        fields = ['title', 'description', 'image']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['description', 'pdf_file_status', 'reviewer_id', 'post']


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ['name', 'category']
        search_fields = ['category']

class CategorySerializer(serializers.ModelSerializer):
    sub_categories = SubCategorySerializer(many=True, read_only=True)  # Modified line
    class Meta:
        model = Category
        fields = ['name', 'sub_categories']
        # search_fields = ['name']
        # list_filter = ['name']