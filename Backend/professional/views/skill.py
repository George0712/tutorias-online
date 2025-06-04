from rest_framework import viewsets, permissions
from professional.models import Skill
from professional.serializers.skill import SkillSerializer
from users.models import Tutor

class SkillViewSet(viewsets.ModelViewSet):
    """
    CRUD para Skill:
    - list, retrieve: PÚBLICOS (AllowAny)
    - create, update, partial_update, destroy: autenticados (solo tutor dueño)
    """
    serializer_class = SkillSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_tutor(self):
        tutor, _ = Tutor.objects.get_or_create(user=self.request.user)
        return tutor

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return Skill.objects.all()
        return Skill.objects.filter(tutor=self.get_tutor())

    def perform_create(self, serializer):
        serializer.save(tutor=self.get_tutor())