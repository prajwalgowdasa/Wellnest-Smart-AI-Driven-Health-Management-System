from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import UserProfile, EmergencyContact
from .serializers import UserSerializer, UserProfileSerializer, EmergencyContactSerializer

User = get_user_model()

@method_decorator(csrf_exempt, name='dispatch')
class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # For demo purposes, we'll return all profiles
        return UserProfile.objects.all()
    
    def get_object(self):
        # Override to allow retrieving the current user's profile using "me" as id
        pk = self.kwargs.get('pk')
        
        if pk == 'me':
            # Get or create a profile for the default user
            default_user, created = User.objects.get_or_create(
                username='default_user',
                defaults={'email': 'default@example.com'}
            )
            obj, created = UserProfile.objects.get_or_create(user=default_user)
            return obj
        
        return super().get_object()
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        # Get or create a profile for the default user
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com', 'first_name': 'John', 'last_name': 'Smith'}
        )
        profile, created = UserProfile.objects.get_or_create(
            user=default_user,
            defaults={
                'date_of_birth': '1985-06-15',
                'gender': 'male',
                'blood_type': 'O+',
                'height_cm': 178,
                'weight_kg': 75,
                'phone_number': '+1 (555) 123-4567'
            }
        )
        
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_me(self, request):
        # Get or create a profile for the default user
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com'}
        )
        profile, created = UserProfile.objects.get_or_create(user=default_user)
        
        serializer = self.get_serializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
        return Response(serializer.data)

@method_decorator(csrf_exempt, name='dispatch')
class EmergencyContactViewSet(viewsets.ModelViewSet):
    serializer_class = EmergencyContactSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # For demo purposes, we'll use a fixed default user
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com'}
        )
        
        return EmergencyContact.objects.filter(user=default_user)
    
    def perform_create(self, serializer):
        # Create emergency contact for the default user
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com'}
        )
        
        serializer.save(user=default_user) 