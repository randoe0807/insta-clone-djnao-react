from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

app_name = 'user'

# router is a variable that is an instance of DefaultRouter
# router.resister() is a method that registers a viewset with a router
router = DefaultRouter()
router.register('profile', views.ProfileViewSet)
router.register('post', views.PostViewSet)
router.register('comment', views.CommentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('myprofile/', views.MyProfileListView.as_view(), name='myprofile'),
    
]
