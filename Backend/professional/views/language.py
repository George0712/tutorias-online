from rest_framework import viewsets, permissions
from professional.models import Language
from professional.serializers.language import LanguageSerializer
from users.models import Tutor

class LanguageViewSet(viewsets.ModelViewSet):
    """
    CRUD para Language:
    - list, retrieve: PÚBLICOS (AllowAny)
    - create, update, partial_update, destroy: autenticados (solo tutor dueño)
    """
    serializer_class = LanguageSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_tutor(self):
        tutor, _ = Tutor.objects.get_or_create(user=self.request.user)
        return tutor

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return Language.objects.all()
        return Language.objects.filter(tutor=self.get_tutor())

    def perform_create(self, serializer):
        serializer.save(tutor=self.get_tutor())