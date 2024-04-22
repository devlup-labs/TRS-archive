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


class ReviewListView(GenericAPIView,mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.CreateModelMixin):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request,post_id, *args, **kwargs):
        post = Post.objects.get(id=post_id)
        reviews = Review.objects.filter(post=post)
        serializer = self.serializer_class(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request,post_id, *args, **kwargs):
        post = Post.objects.get(id=post_id)
        review = Review.objects.get(post=post)
        if str(review.reviewer_id) != request.user.email:
            return Response("You are not authorized to update this review", status=status.HTTP_401_UNAUTHORIZED)
        if 'description' in request.data:
            review.description = request.data['description']
        if 'pdf_file_status' in request.data:
            new_status = request.data['pdf_file_status']
            if new_status in dict(Status_Choices).keys():
                review.pdf_file_status = new_status
            else:
                return Response("Invalid PDF file status provided", status=status.HTTP_400_BAD_REQUEST)
        review.save()
        return Response("Review updated successfully", status=status.HTTP_200_OK)
    
    def post(self, request, post_id, *args, **kwargs):
        post = Post.objects.get(id=post_id)
        if 'description' not in request.data:
            return Response("Description must be provided", status=status.HTTP_400_BAD_REQUEST)
        if 'pdf_file_status' not in request.data:
            return Response("pdf_file_status must be provided", status=status.HTTP_400_BAD_REQUEST)
        if 'pdf_file_status' in request.data:
            new_status = request.data['pdf_file_status']
            if new_status in dict(Status_Choices).keys():
                review = Review.objects.create(
                    description = request.data['description'],
                    pdf_file_status = request.data['pdf_file_status'],
                    reviewer_id = request.user,
                    post = post
                    )   
            else:
                return Response("Invalid PDF file status provided", status=status.HTTP_400_BAD_REQUEST)
        
        serializer = self.serializer_class(review)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
