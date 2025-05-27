from celery import shared_task
from django.utils import timezone
from .models import AIInsight, HealthPrediction, HealthRecommendation
from health.models import HealthRecord, VitalSign, Medication
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import numpy as np

@shared_task
def generate_health_insights():
    """Generate AI insights based on health data."""
    # This is a simplified example. In a real application, you would:
    # 1. Use more sophisticated ML models
    # 2. Consider more health metrics
    # 3. Implement proper data preprocessing
    # 4. Add proper error handling

    # Get recent health records and vital signs
    recent_records = HealthRecord.objects.filter(
        created_at__gte=timezone.now() - timezone.timedelta(days=7)
    )
    
    recent_vitals = VitalSign.objects.filter(
        recorded_at__gte=timezone.now() - timezone.timedelta(days=7)
    )

    # Generate insights based on the data
    for record in recent_records:
        # Example: Generate a recommendation based on the record type
        if record.record_type == 'lab_result':
            insight = AIInsight.objects.create(
                user=record.user,
                type='recommendation',
                category='checkup',
                content='Consider scheduling a follow-up appointment to discuss your lab results.',
                priority='medium'
            )

    # Analyze vital signs trends
    for vital in recent_vitals:
        if vital.heart_rate and vital.heart_rate > 100:
            insight = AIInsight.objects.create(
                user=vital.user,
                type='alert',
                category='exercise',
                content='Your heart rate is elevated. Consider taking a break and resting.',
                priority='high'
            )

@shared_task
def update_health_predictions():
    """Update health predictions based on historical data."""
    # This is a simplified example. In a real application, you would:
    # 1. Use more sophisticated ML models
    # 2. Consider more health metrics
    # 3. Implement proper data preprocessing
    # 4. Add proper error handling

    # Get historical health data
    vital_signs = VitalSign.objects.all()
    
    if vital_signs.exists():
        # Convert to DataFrame for analysis
        data = pd.DataFrame(list(vital_signs.values()))
        
        # Example: Simple prediction model
        # In reality, you would use more sophisticated models
        X = data[['heart_rate', 'blood_pressure_systolic', 'blood_pressure_diastolic']]
        y = np.random.randint(0, 2, size=len(X))  # Example binary outcome
        
        model = RandomForestClassifier()
        model.fit(X, y)
        
        # Make predictions for each user
        for user in vital_signs.values_list('user', flat=True).distinct():
            latest_vitals = vital_signs.filter(user=user).latest('recorded_at')
            
            prediction = HealthPrediction.objects.create(
                user_id=user,
                prediction_type='health_risk',
                prediction_data={
                    'risk_score': float(model.predict_proba([[latest_vitals.heart_rate, 
                                                           latest_vitals.blood_pressure_systolic,
                                                           latest_vitals.blood_pressure_diastolic]])[0][1])
                },
                confidence=0.85  # Example confidence score
            ) 