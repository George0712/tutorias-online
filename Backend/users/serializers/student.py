from rest_framework import serializers
from users.models import Student, User
from users.serializers.user import UserSerializer

class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    
    class Meta:
        model = Student
        fields = ['id', 'user']

    def create (self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create(**user_data)
        return Student.objects.create(user=user, **validated_data)
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        if user_data:
            for attr, value in user_data.items():
                setattr(instance.user, attr, value)
            instance.user.save()
            return instance