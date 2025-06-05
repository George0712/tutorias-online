from rest_framework import serializers
from professional.models import Skill

class SkillSerializer(serializers.ModelSerializer):
    tutor = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Skill
        fields = ['id', 'name', 'level', 'tutor']
