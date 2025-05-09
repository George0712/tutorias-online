from rest_framework import viewsets, permissions
from professional.models import Skill
from professional.serializers.skill import SkillSerializer
from users.models import Tutor


class SkillViewSet(viewsets.ModelViewSet):
    serializer_class   = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_tutor(self):
        tutor, _ = Tutor.objects.get_or_create(user=self.request.user)
        return tutor

    def get_queryset(self):
        return Skill.objects.filter(tutor=self.get_tutor())

    def perform_create(self, serializer):
        serializer.save(tutor=self.get_tutor())