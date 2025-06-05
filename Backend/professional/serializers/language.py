from rest_framework import serializers
from professional.models import Language

class LanguageSerializer(serializers.ModelSerializer):
    tutor = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Language
        fields = ['id', 'name', 'level','tutor']