from rest_framework import generics, permissions
from users.serializers.registration import UserProfileSerializer
from users.models import Student


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Endpoint para obtener y actualizar la información personal del usuario autenticado.
    URL: GET/PUT api/auth/profile/user/
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Devuelve siempre el usuario logueado
        return self.request.user
    
    def perform_update(self, serializer):
        user = serializer.save()
        # Si el usuario es estudiante, crea el perfil de estudiante
        if user.role == user.STUDENT:
            Student.objects.get_or_create(user=user)
        return user