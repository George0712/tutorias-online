from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from users.models import User

from django.contrib.auth import get_user_model

User = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer genérico para registrar usuarios usando email como username.
    Solo maneja email y password. El role se asigna en la vista.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        email = validated_data.get('email')
        password = validated_data.pop('password')
        username = email
        user = User(username=username, email=email)
        user.set_password(password)
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    token = serializers.CharField(read_only=True)

    def validate(self, data):
        
        email = data.get('email')
        password = data.get('password')

        # Aquí cambiamos a __iexact para buscar sin distinguir mayúsculas
        user = User.objects.filter(email__iexact=email).first()

        if user is None or not user.check_password(password):
            # devolvemos el error por campo, en lugar de non_field_errors
            raise serializers.ValidationError({
                'email': ['Credenciales inválidas.'],
                'password': ['Credenciales inválidas.']
            })

        token, _ = Token.objects.get_or_create(user=user)
        return {
            'email': user.email,
            'token': token.key
        }