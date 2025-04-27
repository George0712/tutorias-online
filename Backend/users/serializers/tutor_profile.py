from rest_framework import serializers
from users.models import Tutor

class TutorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tutor
        fields = {'status', 'about_me', 'fee_per_hour', 'modality'}