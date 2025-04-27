from rest_framework import serializers
from education.models import Education

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = ['id', 'country', 'university', 'title', 'specialization', 'graduation_year']