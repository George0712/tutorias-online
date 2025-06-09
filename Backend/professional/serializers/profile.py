from rest_framework import serializers
from professional.models import ProfessionalProfile
from decimal import Decimal

class ProfessionalProfileSerializer(serializers.ModelSerializer):
    tutor = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = ProfessionalProfile
        fields = ['id', 'status', 'about_me', 'fee_per_hour', 'modality', 'tutor']
        extra_kwargs = {
            'about_me': {'required': True},
            'fee_per_hour': {'required': True},
            'modality': {'required': True}
        }

    def validate_fee_per_hour(self, value):
        if value is not None:
            try:
                # Convertir a Decimal si es string
                if isinstance(value, str):
                    value = Decimal(value)
                if value < 10000:
                    raise serializers.ValidationError("La tarifa por hora debe ser al menos $10,000")
                if value > 1000000:
                    raise serializers.ValidationError("La tarifa por hora no puede ser mayor a $1,000,000")
            except (ValueError, TypeError):
                raise serializers.ValidationError("La tarifa por hora debe ser un número válido")
        return value

    def validate_modality(self, value):
        valid_modalities = ['presencial', 'virtual', 'hibrida']
        if value and value.lower() not in valid_modalities:
            raise serializers.ValidationError(
                f"La modalidad debe ser una de las siguientes: {', '.join(valid_modalities)}"
            )
        return value.lower() if value else value

    def validate(self, data):
        # Validar que todos los campos requeridos estén presentes
        required_fields = ['about_me', 'fee_per_hour', 'modality']
        for field in required_fields:
            if field not in data or data[field] is None:
                raise serializers.ValidationError(f"El campo {field} es requerido")
        return data

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'fee_per_hour' and value is not None:
                # Asegurar que fee_per_hour sea Decimal
                value = Decimal(str(value))
            setattr(instance, attr, value)
        instance.save()
        return instance    