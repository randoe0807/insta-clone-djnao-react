from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.conf import settings

def upload_avatar_path(instance, filename):
    # Get extension of the file (filename.extension)
    ext = filename.split('.')[-1]
    # ex : avatars/1.png
    return '/'.join(['avatars', str(instance.userProfile.id)+str(instance.nickName)+str(".")+str(ext)])

def upload_post_path(instance, filename):
    ext = filename.split('.')[-1]
    return '/'.join(['posts', str(instance.userPost.id)+str(instance.title)+str(".")+str(ext)])

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
    
        if not email:
            raise ValueError('email is must')
        
        user = self.model(email=self.normalize_email(email))
        user.set_password(password)
        user.save(using=self._db)
        
        return user
    
    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        
        return user

class User(AbstractBaseUser, PermissionsMixin):
    
    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    # Called when 'python manage.py createsuperuser'
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    
    def __str__(self):
        return self.email
    
class Profile(models.Model):
    nickName = models.CharField(max_length=20)
    userProfile = models.OneToOneField(
        settings.AUTH_USER_MODEL, related_name='userProfile',
        # CASCADE is when the referenced object is deleted, also delete the objects that have references to it
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(blank=True, null=True, upload_to=upload_avatar_path)
    
    def __str__(self):
        return self.nickName
# Post model
# fields: title, userPost, img, liked, created_on
class Post(models.Model):
    title = models.CharField(max_length=50)
    userPost = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='userPost',
        on_delete=models.CASCADE
    )
    created_on = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(blank=True, null=True, upload_to=upload_post_path)
    liked = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='liked')
    
    def __str__(self):
        return self.title
    
    # @property
    # def num_likes(self):
    #     return self.liked.all().count()
    
    # @property
    # def num_comments(self):
    #     return self.comment_set.all().count()

# Comment model
# fields: text. userComment, post
class Comment(models.Model):
    text = models.TextField(max_length=100)
    userComment = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name='userComment',
        on_delete=models.CASCADE
    )
    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE
    )
    
    def __str__(self):
        return self.text
