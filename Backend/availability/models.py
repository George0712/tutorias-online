from django.db import models
from users.models import Tutor

class TimeSlot(models.Model):
    """
    Franja horaria disponible de un Tutor.
    """
    tutor      = models.ForeignKey(
        Tutor,
        on_delete=models.CASCADE,
        related_name='time_slots'
    )
    start_time = models.DateTimeField()
    end_time   = models.DateTimeField()

    class Meta:
        ordering = ['tutor', 'start_time']
        unique_together = ('tutor', 'start_time', 'end_time')
        # Así un mismo tutor no puede tener dos franjas exactas iguales.

    def __str__(self):
        return f'{self.tutor.user.username}: {self.start_time} → {self.end_time}'