from rest_framework import serializers
from professional.models import ProfessionalProfile

class ProfessionalProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ProfessionalProfile
        fields = ['status', 'about_me', 'fee_per_hour', 'modality']