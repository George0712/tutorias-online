from rest_framework import generics, permissions
from users.serializers.registration import UserProfileSerializer



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