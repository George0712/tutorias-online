from rest_framework import serializers
from users.models import Tutor, User
from users.serializers.user import UserProfileSerializer

class TutorSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()  # este sí es necesario
    
    class Meta:
        model = Tutor
        fields = ['id', 'user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        return Tutor.objects.create(user=user, **validated_data)

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()
        return instance
