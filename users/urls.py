from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.UserProfileViewSet, basename='profile')
router.register(r'emergency-contacts', views.EmergencyContactViewSet, basename='emergency-contact')

urlpatterns = [
    path('', include(router.urls)),
] 