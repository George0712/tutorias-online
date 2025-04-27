# users/views/auth.py
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from users.serializers.auth import RegistrationSerializer, LoginSerializer
from users.models import Student

User = get_user_model()

class StudentRegisterView(APIView):
    """
    Endpoint para registrar estudiantes.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.role = User.STUDENT
            user.save()
            # Crear perfil de estudiante
            Student.objects.create(user=user)
            return Response({"email": user.email, "role": user.role},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TutorRegisterView(APIView):
    """
    Endpoint para registrar tutores (solo crea el usuario y asigna rol).
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user.role = User.TUTOR
            user.save()
            # Perfil de Tutor se completará en siguiente paso
            return Response({"email": user.email, "role": user.role},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginAPIView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


