from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    HealthRecordViewSet,
    VitalSignViewSet,
    MedicationViewSet,
    AppointmentViewSet
)

router = DefaultRouter()
router.register(r'records', HealthRecordViewSet)
router.register(r'vitals', VitalSignViewSet)
router.register(r'medications', MedicationViewSet)
router.register(r'appointments', AppointmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 