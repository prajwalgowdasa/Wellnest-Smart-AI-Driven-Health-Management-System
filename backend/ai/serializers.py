from rest_framework import serializers
from .models import AIInsight, HealthPrediction, HealthRecommendation

class AIInsightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIInsight
        fields = ['id', 'type', 'category', 'content', 'priority', 'record', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

class HealthPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthPrediction
        fields = ['id', 'prediction_type', 'prediction_data', 'confidence', 'created_at']
        read_only_fields = ['created_at']

class HealthRecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecommendation
        fields = ['id', 'category', 'recommendation', 'source', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at'] 