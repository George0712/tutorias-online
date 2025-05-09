from rest_framework import viewsets, permissions
from professional.models import Education
from professional.serializers.education import EducationSerializer
from users.models import Tutor


class EducationViewSet(viewsets.ModelViewSet):
    """
    CRUD para Education. Solo accesible para usuarios autenticados.
    Auto-crea perfil de Tutor si no existe.
    """
    serializer_class   = EducationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_tutor(self):
        tutor, _ = Tutor.objects.get_or_create(user=self.request.user)
        return tutor

    def get_queryset(self):
        return Education.objects.filter(tutor=self.get_tutor())

    def perform_create(self, serializer):
        serializer.save(tutor=self.get_tutor())