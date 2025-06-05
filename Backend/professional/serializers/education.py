from rest_framework import serializers
from users.models import Tutor
from professional.models import Education

class EducationSerializer(serializers.ModelSerializer):
    tutor = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Education
        fields = ['id', 'country', 'university', 'title', 'specialization', 'graduation_year','tutor']