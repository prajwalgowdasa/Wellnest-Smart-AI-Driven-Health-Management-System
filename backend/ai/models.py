from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AIInsight(models.Model):
    INSIGHT_TYPES = (
        ('health_risk', 'Health Risk'),
        ('recommendation', 'Recommendation'),
        ('goal', 'Goal'),
        ('alert', 'Alert'),
    )

    CATEGORIES = (
        ('diet', 'Diet'),
        ('exercise', 'Exercise'),
        ('sleep', 'Sleep'),
        ('medication', 'Medication'),
        ('checkup', 'Checkup'),
        ('other', 'Other'),
    )

    PRIORITIES = (
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_insights')
    type = models.CharField(max_length=20, choices=INSIGHT_TYPES)
    category = models.CharField(max_length=20, choices=CATEGORIES)
    content = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITIES, null=True, blank=True)
    record = models.ForeignKey('health.HealthRecord', on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_type_display()} - {self.category}"

class HealthPrediction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_predictions')
    prediction_type = models.CharField(max_length=50)
    prediction_data = models.JSONField()
    confidence = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.prediction_type} prediction for {self.user.username}"

class HealthRecommendation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='health_recommendations')
    category = models.CharField(max_length=50)
    recommendation = models.TextField()
    source = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.category} recommendation for {self.user.username}" 