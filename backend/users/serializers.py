from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, EmergencyContact

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id', 'username']

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    bmi = serializers.ReadOnlyField()
    bmi_status = serializers.ReadOnlyField()
    height_display = serializers.ReadOnlyField()
    weight_display = serializers.ReadOnlyField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number',
            'date_of_birth', 'gender', 'blood_type', 'height_cm',
            'weight_kg', 'profile_image', 'bmi', 'bmi_status',
            'height_display', 'weight_display'
        ]
        read_only_fields = ['id']
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        
        # Update User model fields
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        
        # Update UserProfile model fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ['id', 'name', 'relationship', 'phone_number', 'email']
        read_only_fields = ['id'] 