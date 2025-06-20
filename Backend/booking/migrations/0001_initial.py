# Generated by Django 5.2 on 2025-06-01 21:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('availability', '0001_initial'),
        ('users', '0002_remove_tutor_about_me_remove_tutor_fee_per_hour_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Booking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('canceled', 'Canceled'), ('completed', 'Completed')], default='pending', max_length=20)),
                ('message', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='users.student')),
                ('timeslot', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='availability.timeslot')),
                ('tutor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='bookings', to='users.tutor')),
            ],
            options={
                'ordering': ['-created_at'],
                'unique_together': {('tutor', 'timeslot')},
            },
        ),
    ]
