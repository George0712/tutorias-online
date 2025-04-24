from rest_framework import serializers
from users.models import User, Student, Tutor

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        field = ['id', 'email', 'first_name', 'last_name', 'role' 'photo', 'number_phone', 'location']


    

