from django.db import models
from users.models import Tutor


class Education(models.Model):
    """
    Historial académico de un Tutor.
    """
    tutor           = models.ForeignKey(
        Tutor,
        on_delete=models.CASCADE,
        related_name='educations',
        null=True,      # temporalmente opcional para migraciones
        blank=True
    )
    country         = models.CharField(max_length=100)
    university      = models.CharField(max_length=255)
    title           = models.CharField(max_length=255)
    specialization  = models.CharField(max_length=255)
    # default debe ser un entero, no un string
    graduation_year = models.PositiveIntegerField()

    def __str__(self):
        return f'{self.title} en {self.university} ({self.graduation_year})'


class Skill(models.Model):
    """
    Habilidad y experiencia de un Tutor.
    """
    tutor = models.ForeignKey(
        Tutor,
        on_delete=models.CASCADE,
        related_name='skills',
        null=True,
        blank=True
    )
    name  = models.CharField(max_length=100)
    level = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.name} ({self.level})'


class Language(models.Model):
    """
    Idioma y nivel de un Tutor.
    """
    tutor = models.ForeignKey(
        Tutor,
        on_delete=models.CASCADE,
        related_name='languages',
        null=True,
        blank=True
    )
    name  = models.CharField(max_length=100)
    level = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.name} ({self.level})'
    
class ProfessionalProfile(models.Model):
    tutor         = models.OneToOneField(
        Tutor,
        on_delete=models.CASCADE,
        related_name='professional_profile'
    )
    status        = models.BooleanField(default=True)
    about_me      = models.TextField(blank=True, null=True)
    fee_per_hour  = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    modality      = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return f'Perfil profesional de {self.tutor.user.username}'
