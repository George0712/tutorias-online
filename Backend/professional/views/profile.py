from rest_framework import viewsets, permissions
from professional.models import ProfessionalProfile
from professional.serializers.profile import ProfessionalProfileSerializer

class ProfessionalProfileViewSet(viewsets.ModelViewSet):
    serializer_class   = ProfessionalProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProfessionalProfile.objects.filter(
            tutor__user=self.request.user
        )

    def perform_create(self, serializer):
        tutor = self.request.user.tutor_profile
        serializer.save(tutor=tutor)