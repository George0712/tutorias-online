# users/serializers/auth.py

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from users.models import Tutor
from professional.models import ProfessionalProfile

User = get_user_model()

class RegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer para registrar usuarios usando email como username.
    Solo maneja email y password. El role se asigna en la vista.
    """
    password = serializers.CharField(write_only=True)

    class Meta:
        model  = User
        fields = ['email', 'password']

    def create(self, validated_data):
        email    = validated_data['email']
        password = validated_data.pop('password')
        user = User(username=email, email=email)
        user.set_password(password)
        user.save()
        return user


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
        if not user or not user.check_password(password):
            raise serializers.ValidationError({
                'email':    ['Credenciales inválidas.'],
                'password': ['Credenciales inválidas.']
            })

        token, _ = Token.objects.get_or_create(user=user)

        # 1) Datos personales completos?
        personal_fields = [
            user.first_name,
            user.last_name,
            user.id_number,
            user.location,
            user.number_phone,
        ]
        has_personal = all(bool(f) for f in personal_fields)

        # 2) Perfil profesional: solo para tutores
        has_professional = False
        if user.role == User.TUTOR:
            # a) Obtén el objeto Tutor, si existe
            tutor = Tutor.objects.filter(user=user).first()
            if tutor:
                # b) Intenta obtener el profile profesional
                prof = getattr(tutor, 'professional_profile', None)
                if prof:
                    core_ok = (
                        bool(prof.about_me) and
                        prof.fee_per_hour is not None and
                        bool(prof.modality)
                    )
                    # c) Comprueba también al menos 1 registro en cada relación
                    has_educ = tutor.educations.exists()
                    has_skl  = tutor.skills.exists()
                    has_lang = tutor.languages.exists()
                    has_professional = core_ok and has_educ and has_skl and has_lang

        return {
            'token':                 token.key,
            'role':                  user.role,
            'has_personal_data':     has_personal,
            'has_professional_data': has_professional,
        }