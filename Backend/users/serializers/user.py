from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para consulta y actualización de información personal del usuario.
    Campos: first_name, last_name, id_number, location, number_phone.
    """
    first_name   = serializers.CharField(required=True)
    last_name    = serializers.CharField(required=True)
    id_number    = serializers.CharField(required=True)
    location     = serializers.CharField(required=True)
    number_phone = serializers.CharField(required=True)
    photo        = serializers.ImageField(required=False)
    birthdate    = serializers.DateField(required=False)

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'id_number', 'location', 'number_phone', 'photo', 'birthdate']

    def update(self, instance, validated_data):
        # Single Responsibility: solo actualiza datos personales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
