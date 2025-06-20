# professional/views/profile.py

from django.http import Http404
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from users.models import Tutor

from professional.models import ProfessionalProfile
from professional.serializers.profile import ProfessionalProfileSerializer


class ProfessionalProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ProfessionalProfileSerializer
    http_method_names = ['get', 'post', 'put', 'patch', 'delete']  # Permitir PATCH explícitamente

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

    def get_object(self):
        try:
            # Obtener el perfil del usuario actual
            tutor = self.request.user.tutor_profile
            return ProfessionalProfile.objects.get(tutor=tutor)
        except (ProfessionalProfile.DoesNotExist, Tutor.DoesNotExist):
            raise Http404("No se encontró el perfil profesional")

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
            instance = self.get_object()
            partial = kwargs.pop('partial', False)
            serializer = self.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)
        except Http404 as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_404_NOT_FOUND
            )
        except ValidationError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"detail": f"Error al actualizar el perfil: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def perform_update(self, serializer):
        serializer.save()
