from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from .models import AIInsight, HealthPrediction, HealthRecommendation
from .serializers import (
    AIInsightSerializer,
    HealthPredictionSerializer,
    HealthRecommendationSerializer
)

@method_decorator(csrf_exempt, name='dispatch')
class AIInsightViewSet(viewsets.ModelViewSet):
    serializer_class = AIInsightSerializer
    permission_classes = [AllowAny]
    queryset = AIInsight.objects.all()

    def get_queryset(self):
        # Return all insights for now, no user filtering
        return AIInsight.objects.all()

    def perform_create(self, serializer):
        # Get or create a default user for development purposes
        User = get_user_model()
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com'}
        )
        serializer.save(user=default_user)

    @action(detail=False, methods=['get'])
    def recent(self, request):
        recent_insights = self.get_queryset().order_by('-created_at')[:5]
        serializer = self.get_serializer(recent_insights, many=True)
        return Response(serializer.data)

@method_decorator(csrf_exempt, name='dispatch')
class HealthPredictionViewSet(viewsets.ModelViewSet):
    serializer_class = HealthPredictionSerializer
    permission_classes = [AllowAny]
    queryset = HealthPrediction.objects.all()

    def get_queryset(self):
        # Return all predictions for now, no user filtering
        return HealthPrediction.objects.all()

    def perform_create(self, serializer):
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
            latest_prediction = self.get_queryset().latest('created_at')
            serializer = self.get_serializer(latest_prediction)
            return Response(serializer.data)
        except HealthPrediction.DoesNotExist:
            return Response({"detail": "No predictions available yet."}, status=status.HTTP_404_NOT_FOUND)

@method_decorator(csrf_exempt, name='dispatch')
class HealthRecommendationViewSet(viewsets.ModelViewSet):
    serializer_class = HealthRecommendationSerializer
    permission_classes = [AllowAny]
    queryset = HealthRecommendation.objects.all()

    def get_queryset(self):
        # Return all recommendations for now, no user filtering
        return HealthRecommendation.objects.all()

    def perform_create(self, serializer):
        # Get or create a default user for development purposes
        User = get_user_model()
        default_user, created = User.objects.get_or_create(
            username='default_user',
            defaults={'email': 'default@example.com'}
        )
        serializer.save(user=default_user)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        category = request.query_params.get('category', None)
        if category:
            recommendations = self.get_queryset().filter(category=category)
        else:
            recommendations = self.get_queryset()
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data) 