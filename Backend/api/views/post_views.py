from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render, get_object_or_404
from api.models import User, Post, Comment, New, Review
from api.serializer import ReviewSerializer

from rest_framework import status,generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from api.serializer import *
from rest_framework import status
from rest_framework.generics import CreateAPIView, GenericAPIView, ListAPIView, mixins, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
import os
from django.conf import settings
import datetime
from django.db import IntegrityError
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail, EmailMultiAlternatives
import os

from ..models import *

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
            # print("hello")
            return Response("FILE is missing", status=status.HTTP_400_BAD_REQUEST)
    
        # print("hello")
    
        # user = request.user 
        email=request.data.get('user')
        user = User.objects.get(email=email)
        # print(user)

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

            file_path = post.document.path

            # Attach the file to the email
            self.email_for_post_success(email, post, file_path)
            return Response("File uploaded successfully", status=status.HTTP_201_CREATED)
        
        except Exception as e:
            message = {'detail': str(e)}  # Return specific error message
            print(message)
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
        

    def email_for_post_success(self, email, post, file_path):
        subject = 'Successful upload of paper on trs_arxiv'

        message = (
            "Dear User,\n\n"
            "We are pleased to inform you that your paper has been successfully uploaded to trs_arxiv.\n\n"
            "Here are the details of your submission:\n\n"
            f"Title: {post.title}\n"
            f"Category: {post.category}\n"
            f"Sub-category: {post.sub_category}\n\n"
            "Thank you for your contribution!\n\n"
            "If you have any questions or need further assistance, please don't hesitate to contact us.\n\n"
            "Best regards,\n"
            "The trs_arxiv Team"
        )

        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]

        # Create the email message
        email_message = EmailMultiAlternatives(
            subject=subject,
            body=message,
            from_email=from_email,
            to=recipient_list
        )

        # Attach the file
        file_name = os.path.basename(file_path)
        with open(file_path, 'rb') as f:
            email_message.attach(file_name, f.read(), 'application/pdf')  # Adjust content type as needed

        email_message.send()





class ParticularUserPost(GenericAPIView, mixins.ListModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, *args, **kwargs):
        posts = Post.objects.filter(user=user_id)
        serializer = self.serializer_class(posts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, user_id, post_id, *args, **kwargs):
        user = request.user
        post = get_object_or_404(Post, id=post_id, user=user_id)
        if user != post.user:
            return Response("You are not authorized to delete this post", status=status.HTTP_401_UNAUTHORIZED)
        post.delete()
        return Response("Post deleted successfully", status=status.HTTP_200_OK)

    def put(self, request, user_id, post_id, *args, **kwargs):
        user = request.user
        post = get_object_or_404(Post, id=post_id, user=user_id)
        if user != post.user:
            return Response("You are not authorized to update this post", status=status.HTTP_401_UNAUTHORIZED)
        if request.data.get('title'):
            post.title = request.data.get('title')
        if request.data.get('body'):
            post.body = request.data.get('body')
        if request.data.get('category'):
            post.category = request.data.get('category')
        if request.data.get('sub_category'):
            post.sub_category = request.data.get('sub_category')
        post.save()
        return Response("Post updated successfully", status=status.HTTP_200_OK)

class singlepostfromparticularuser(GenericAPIView, mixins.RetrieveModelMixin):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id, post_id, *args, **kwargs):
        post = get_object_or_404(Post, id=post_id, user=user_id)
        serializer = self.serializer_class(post)
        return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def getParticularPost(request,post_id):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        return Response({"message": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = PostSerializer(post)
    return Response(serializer.data, status=status.HTTP_200_OK)




@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def Send_Mail_Review(request):

    #this function gets input of the email_id and post
    try:
        email=request.data.get('email_id')
        post_id=request.data.get('post_id')
        
        try:
            post = Post.objects.get(id=post_id) 
        except Post.DoesNotExist:
            return Response(message,status=status.HTTP_400_BAD_REQUEST)
        
        subject = f'Regarding review of Post:{post.title}'
        message = f'Here is the content of the post:\n\n{post.body}.'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]

        email_message = EmailMultiAlternatives(
                subject=subject,
                body=message,
                from_email=from_email,
                to=recipient_list
            )
        
        file_path=post.document.path
        
        # Send the email
        file_name = os.path.basename(file_path)
        with open(file_path, 'rb') as f:
            email_message.attach(file_name, f.read(), 'application/pdf')  # Adjust content type as needed

        email_message.send()
        
        return Response("Email sended to reviewers successfully", status=status.HTTP_201_CREATED)


    except Exception as e:
        message = {'detail': str(e)}  # Return specific error message
        print(message)
        return Response(message, status=status.HTTP_400_BAD_REQUEST)






