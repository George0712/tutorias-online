from rest_framework import serializers
from .models import User, Student, Tutor

class EducationSerializer(serializers.ModelSerializer):
    """
    Serializer para el modelo Education.
    """
    class Meta:
        model = User
        fields = ['id', 'name', 'description', 'level', 'subject', 'created_at']