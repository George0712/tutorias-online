from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from users.serializers.tutor_profile import TutorProfileSerializer
from users.models import Tutor
from django.shortcuts import get_object_or_404
from rest_framework import status

class TutorProfileView(APIView):
    """
    Endpoint para crear o actualizar el perfil de Tutor
    después de registrarse.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        tutor = get_object_or_404(Tutor, user=request.user)
        serializer = TutorProfileSerializer(tutor)
        return Response(serializer.data)

    def put(self, request):
        # Si no existe, lo crea
        tutor, _ = Tutor.objects.get_or_create(user=request.user)
        serializer = TutorProfileSerializer(tutor, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)


