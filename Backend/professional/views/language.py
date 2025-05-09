from rest_framework import viewsets, permissions
from professional.models import Language
from professional.serializers.language import LanguageSerializer
from users.models import Tutor



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