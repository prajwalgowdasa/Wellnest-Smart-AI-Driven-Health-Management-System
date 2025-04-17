from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Medication, Appointment
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def check_medication_reminders():
    """Check for upcoming medication schedules and send reminders."""
    now = timezone.now()
    upcoming_medications = Medication.objects.filter(
        end_date__isnull=True,  # Active medications
        start_date__lte=now.date()  # Started medications
    )

    for medication in upcoming_medications:
        # Send reminder 30 minutes before scheduled time
        reminder_time = now + timedelta(minutes=30)
        
        # In a real application, you would implement the actual reminder logic here
        # For example, sending emails or push notifications
        send_mail(
            subject=f'Medication Reminder: {medication.name}',
            message=f'Time to take {medication.name} ({medication.dosage})',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[medication.user.email],
            fail_silently=True,
        )

@shared_task
def check_appointment_reminders():
    """Check for upcoming appointments and send reminders."""
    now = timezone.now()
    upcoming_appointments = Appointment.objects.filter(
        date__gt=now,
        date__lte=now + timedelta(hours=24)  # Appointments in the next 24 hours
    )

    for appointment in upcoming_appointments:
        # Send reminder 1 hour before appointment
        reminder_time = appointment.date - timedelta(hours=1)
        if now >= reminder_time:
            send_mail(
                subject=f'Appointment Reminder: {appointment.doctor}',
                message=f'You have an appointment with {appointment.doctor} at {appointment.date}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[appointment.user.email],
                fail_silently=True,
            ) 