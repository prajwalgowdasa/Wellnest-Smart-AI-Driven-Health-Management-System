from rest_framework import serializers
from .models import HealthRecord, VitalSign, Medication, Appointment

class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = ['id', 'title', 'record_type', 'doctor', 'date', 'description', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class VitalSignSerializer(serializers.ModelSerializer):
    class Meta:
        model = VitalSign
        fields = ['id', 'heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic', 
                 'temperature', 'recorded_at']
        read_only_fields = ['recorded_at']

class MedicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medication
        fields = ['id', 'name', 'dosage', 'frequency', 'start_date', 'end_date', 'notes', 
                 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'doctor', 'date', 'purpose', 'location', 'notes', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] 