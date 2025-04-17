from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
        ('prefer_not_to_say', 'Prefer not to say'),
    )
    
    BLOOD_TYPE_CHOICES = (
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, blank=True)
    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPE_CHOICES, blank=True)
    height_cm = models.IntegerField(null=True, blank=True)  # Height in centimeters
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)  # Weight in kg
    phone_number = models.CharField(max_length=20, blank=True)
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    @property
    def bmi(self):
        if self.height_cm and self.weight_kg:
            height_m = self.height_cm / 100
            bmi = float(self.weight_kg) / (height_m * height_m)
            return round(bmi, 1)
        return None
    
    @property
    def bmi_status(self):
        if not self.bmi:
            return None
        
        if self.bmi < 18.5:
            return "Underweight"
        elif self.bmi < 25:
            return "Normal"
        elif self.bmi < 30:
            return "Overweight"
        else:
            return "Obese"
    
    @property
    def height_display(self):
        if not self.height_cm:
            return ""
        
        # Convert cm to feet and inches
        total_inches = self.height_cm / 2.54
        feet = int(total_inches // 12)
        inches = int(total_inches % 12)
        
        return f"{feet}' {inches}\" ({self.height_cm} cm)"
    
    @property
    def weight_display(self):
        if not self.weight_kg:
            return ""
        
        # Convert kg to lbs
        lbs = round(float(self.weight_kg) * 2.20462, 1)
        
        return f"{lbs} lbs ({self.weight_kg} kg)"

class EmergencyContact(models.Model):
    RELATIONSHIP_CHOICES = (
        ('spouse', 'Spouse'),
        ('parent', 'Parent'),
        ('child', 'Child'),
        ('sibling', 'Sibling'),
        ('friend', 'Friend'),
        ('other', 'Other'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_contacts')
    name = models.CharField(max_length=100)
    relationship = models.CharField(max_length=20, choices=RELATIONSHIP_CHOICES)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.name} ({self.relationship})" 