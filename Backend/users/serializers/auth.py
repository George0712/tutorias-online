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

from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from users.models import Tutor
from professional.models import Education, Skill, Language  # ajusta el import

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email                 = serializers.EmailField()
    password              = serializers.CharField(write_only=True)
    token                 = serializers.CharField(read_only=True)
    role                  = serializers.CharField(read_only=True)
    has_personal_data     = serializers.BooleanField(read_only=True)
    has_professional_data = serializers.BooleanField(read_only=True)

    def validate(self, data):
        email    = data.get('email')
        password = data.get('password')

        user = User.objects.filter(email__iexact=email).first()
        if user is None or not user.check_password(password):
            raise serializers.ValidationError({
                'email':    ['Credenciales inválidas.'],
                'password': ['Credenciales inválidas.']
            })

        token, _ = Token.objects.get_or_create(user=user)

        # 1) Datos personales completos?
        personal_fields = [
            user.first_name, user.last_name,
            user.id_number, user.location,
            user.number_phone
        ]
        has_personal = all(bool(f) for f in personal_fields)

        # 2) Perfil profesional: about_me, fee, modality
        # 3) Datos de la app professional: al menos 1 registro en cada modelo
        has_professional = False
        if user.role == User.TUTOR:
            try:
                tutor = user.tutor_profile
                core_profile_ok = all([
                    bool(tutor.about_me),
                    tutor.fee_per_hour is not None,
                    bool(tutor.modality),
                ])
                # comprueba existencia de al menos un registro
                has_educations = tutor.educations.exists()
                has_skills     = tutor.skills.exists()
                has_languages  = tutor.languages.exists()
                has_professional = core_profile_ok and has_educations and has_skills and has_languages
            except Tutor.DoesNotExist:
                has_professional = False

        return {
            'token':                 token.key,
            'role':                  user.role,
            'has_personal_data':     has_personal,
            'has_professional_data': has_professional,
        }