from django.db import models
from availability.models import TimeSlot
from users.models import Student, Tutor

class Booking(models.Model):
    PENDING   = 'pending'
    CONFIRMED = 'confirmed'
    CANCELED  = 'canceled'
    COMPLETED = 'completed'

    STATUS_CHOICES = [
        (PENDING,   'Pending'),
        (CONFIRMED, 'Confirmed'),
        (CANCELED,  'Canceled'),
        (COMPLETED, 'Completed'),
    ]

    student    = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    tutor      = models.ForeignKey(
        Tutor,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    timeslot   = models.ForeignKey(
        TimeSlot,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    status     = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default=PENDING
    )
    message    = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Impide que un mismo tutor tenga dos bookings para la misma franja
        unique_together = ('tutor', 'timeslot')
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.id} | {self.student.user.username} → {self.tutor.user.username} @ {self.timeslot}"