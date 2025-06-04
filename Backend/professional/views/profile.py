# professional/views/profile.py

from django.http import Http404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response

from professional.models import ProfessionalProfile
from professional.serializers.profile import ProfessionalProfileSerializer


class ProfessionalProfileViewSet(viewsets.ModelViewSet):

    serializer_class = ProfessionalProfileSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return ProfessionalProfile.objects.all()
        return ProfessionalProfile.objects.filter(
            tutor__user=self.request.user
        )

    def perform_create(self, serializer):
        tutor = self.request.user.tutor_profile
        serializer.save(tutor=tutor)

    def create(self, request, *args, **kwargs):

        tutor = request.user.tutor_profile
        if ProfessionalProfile.objects.filter(tutor=tutor).exists():
            return Response(
                {"detail": "Ya existe un perfil profesional para este tutor."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):

        try:
            self.get_object()
        except Http404:
            return self.create(request, *args, **kwargs)

        return super().update(request, *args, **kwargs)
