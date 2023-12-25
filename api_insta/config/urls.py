
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
# static is a function that takes a url and a document root
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    # djoser is a REST implementation of Django authentication system
    path('authen/', include('djoser.urls.jwt')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)