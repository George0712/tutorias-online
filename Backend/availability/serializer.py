from rest_framework import serializers
from availability.models import TimeSlot

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TimeSlot
        fields = ['id', 'tutor', 'start_time', 'end_time']
        read_only_fields = ['tutor']