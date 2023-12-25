from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from . import serializers
from .models import Profile, Post, Comment

class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer
    # AllowAny: anyone can access this view
    permission_classes = (AllowAny,)
    
class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    
    # override the perform_create method
    # perform_create: called when a POST request is made
    # userProfile: the user who is making the request
    def perform_create(self, serializer):
        serializer.save(userProfile=self.request.user)

class MyProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    
    # override the get_queryset method
    # get_queryset: called when a GET request is made
    # userProfile: only login user can access this view
    def get_queryset(self):
        return self.queryset.filter(userProfile=self.request.user)

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = serializers.PostSerializer
    
    # override the perform_create method
    # perform_create: called when a POST request is made
    # userPost: the user who is making the request
    def perform_create(self, serializer):
        serializer.save(userPost=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer
    
    # override the perform_create method
    # perform_create: called when a POST request is made
    # userComment: the user who is making the request
    def perform_create(self, serializer):
        serializer.save(userComment=self.request.user)