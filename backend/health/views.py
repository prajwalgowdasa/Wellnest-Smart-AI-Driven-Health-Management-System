from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .models import HealthRecord, VitalSign, Medication, Appointment
from .serializers import (
    HealthRecordSerializer,
    VitalSignSerializer,
    MedicationSerializer,
    AppointmentSerializer
)
from django.contrib.auth import get_user_model

@method_decorator(csrf_exempt, name='dispatch')
class HealthRecordViewSet(viewsets.ModelViewSet):
    serializer_class = HealthRecordSerializer
    permission_classes = [AllowAny]
    queryset = HealthRecord.objects.all()

    def get_queryset(self):
        # Return all records for now, no user filtering
        return HealthRecord.objects.all()

    def perform_create(self, serializer):
        # Get or create a default user for development purposes
        User = get_user_model()
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com'}
        )
        serializer.save(user=default_user)

@method_decorator(csrf_exempt, name='dispatch')
class VitalSignViewSet(viewsets.ModelViewSet):
    serializer_class = VitalSignSerializer
    permission_classes = [AllowAny]
    queryset = VitalSign.objects.all()

    def get_queryset(self):
        # Return all records for now, no user filtering
        return VitalSign.objects.all()

    def perform_create(self, serializer):
        # Skip user assignment for now but add a default user
        # Get or create a default user for development purposes
        User = get_user_model()
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com'}
        )
        serializer.save(user=default_user)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        try:
            latest_vital = self.get_queryset().latest('recorded_at')
            serializer = self.get_serializer(latest_vital)
            return Response(serializer.data)
        except VitalSign.DoesNotExist:
            # Return a default empty response with 200 status instead of 404
            return Response({
                "heart_rate": None,
                "blood_pressure_systolic": None,
                "blood_pressure_diastolic": None,
                "temperature": None,
            }, status=status.HTTP_200_OK)

@method_decorator(csrf_exempt, name='dispatch')
class MedicationViewSet(viewsets.ModelViewSet):
    serializer_class = MedicationSerializer
    permission_classes = [AllowAny]
    queryset = Medication.objects.all()

    def get_queryset(self):
        # Return all records for now, no user filtering
        return Medication.objects.all()

    def perform_create(self, serializer):
        # Get or create a default user for development purposes
        User = get_user_model()
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com'}
        )
        serializer.save(user=default_user)

    @action(detail=False, methods=['get'])
    def active(self, request):
        active_medications = self.get_queryset().filter(end_date__isnull=True)
        serializer = self.get_serializer(active_medications, many=True)
        return Response(serializer.data)

@method_decorator(csrf_exempt, name='dispatch')
class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [AllowAny]
    queryset = Appointment.objects.all()

    def get_queryset(self):
        # Return all records for now, no user filtering
        return Appointment.objects.all()

    def perform_create(self, serializer):
        # Get or create a default user for development purposes
        User = get_user_model()
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com'}
        )
        serializer.save(user=default_user)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        upcoming_appointments = self.get_queryset().filter(
            date__gte=timezone.now()
        ).order_by('date')
        serializer = self.get_serializer(upcoming_appointments, many=True)
        return Response(serializer.data) 