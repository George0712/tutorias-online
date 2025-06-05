from rest_framework import serializers
from professional.models import ProfessionalProfile

class ProfessionalProfileSerializer(serializers.ModelSerializer):
    tutor = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model  = ProfessionalProfile
        fields = ['id','status', 'about_me', 'fee_per_hour', 'modality','tutor']    