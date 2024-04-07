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


from ..models import *

from django.core.mail import send_mail



class ReviewListView(generics.ListAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]


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

