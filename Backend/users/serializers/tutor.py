from rest_framework import serializers
from users.models import Tutor, User
from serializers.user import UserSerializer

class TutorSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Tutor
        fields = ['id', 'user', 'status', 'about_me', 'fee_per_hour', 'modality']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        return Tutor.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance