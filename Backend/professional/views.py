from rest_framework import viewsets, permissions
from professional.models import Education, Skill, Language
from professional.serializers.education import EducationSerializer
from professional.serializers.skill import SkillSerializer
from professional.serializers.language import LanguageSerializer
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

class LanguageViewSet(viewsets.ModelViewSet):
    serializer_class   = LanguageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_tutor(self):
        tutor, _ = Tutor.objects.get_or_create(user=self.request.user)
        return tutor

    def get_queryset(self):
        return Language.objects.filter(tutor=self.get_tutor())

    def perform_create(self, serializer):
        serializer.save(tutor=self.get_tutor())
