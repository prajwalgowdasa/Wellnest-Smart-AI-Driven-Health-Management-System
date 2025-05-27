from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
<<<<<<< HEAD
=======
from django.conf import settings
from django.conf.urls.static import static
>>>>>>> a5703aa2 (update in record detail page and error handle)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/health/', include('health.urls')),
    path('api/ai/', include('ai.urls')),
    path('api/users/', include('users.urls')),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
<<<<<<< HEAD
] 
=======
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) 
>>>>>>> a5703aa2 (update in record detail page and error handle)
