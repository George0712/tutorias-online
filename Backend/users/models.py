from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    STUDENT = 'student'
    TUTOR = 'tutor'
    ROLE_CHOICES = [
        (STUDENT, "Student"),
        (TUTOR, "Tutor"),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    photo = models.ImageField(upload_to='profile_photos', blank=True, null=True)
    number_phone = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='student_profile'
    )

    def __str__(self):
        return self.user.username

class Tutor(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, 
        related_name='tutor_profile'
    )
    status = models.BooleanField(default=True)
    about_me = models.TextField(blank=True, null=True)
    fee_per_hour = models.DecimalField(max_digits=6, decimal_places=2)
    modality = models.CharField(max_length=50)

    def __str__(self):
        return f'Tutor: {self.user.username}'

