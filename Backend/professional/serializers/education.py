from rest_framework import serializers
from professional.models import Education

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'country', 'university', 'title', 'specialization', 'graduation_year']