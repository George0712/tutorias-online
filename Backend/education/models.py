from django.db import models

from django.conf import settings

class Education(models.Model):
    tutor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='educations'
    )
    institution = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField(blank=True, null=True)

class Skill(models.Model):
    tutor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skills'
    )
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=50, blank=True)

class Language(models.Model):
    tutor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='languages'
    )
    name = models.CharField(max_length=100)
    proficiency = models.CharField(max_length=50, blank=True)
# Create your models here.
