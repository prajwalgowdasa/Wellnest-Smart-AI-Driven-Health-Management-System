import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('hackaloop')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

# Scheduled tasks
app.conf.beat_schedule = {
    'check-medication-reminders': {
        'task': 'health.tasks.check_medication_reminders',
        'schedule': 300.0,  # Every 5 minutes
    },
    'check-appointment-reminders': {
        'task': 'health.tasks.check_appointment_reminders',
        'schedule': 300.0,  # Every 5 minutes
    },
    'generate-health-insights': {
        'task': 'ai.tasks.generate_health_insights',
        'schedule': 3600.0,  # Every hour
    },
    'update-health-predictions': {
        'task': 'ai.tasks.update_health_predictions',
        'schedule': 86400.0,  # Every day
    },
} 