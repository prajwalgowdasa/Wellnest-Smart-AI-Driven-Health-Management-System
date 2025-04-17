from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AIInsightViewSet,
    HealthPredictionViewSet,
    HealthRecommendationViewSet
)

router = DefaultRouter()
router.register(r'insights', AIInsightViewSet)
router.register(r'predictions', HealthPredictionViewSet)
router.register(r'recommendations', HealthRecommendationViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 