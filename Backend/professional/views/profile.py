from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from professional.models import ProfessionalProfile
from professional.serializers.profile import ProfessionalProfileSerializer

class ProfessionalProfileViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar el perfil profesional de los tutores.

    - list, retrieve: PÚBLICO (AllowAny) → muestra todos los perfiles.
    - create, update, partial_update, destroy: 
        PROTEGIDO (IsAuthenticated) → solo el tutor dueño puede crearlo o modificarlo.
    """

    serializer_class = ProfessionalProfileSerializer

    def get_permissions(self):
        # Acciones de solo lectura (list, retrieve) son públicas:
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        # Cualquier otra acción (create, update, delete) requiere token:
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Si es acción pública, devolvemos *todos* los perfiles profesionales:
        if self.action in ['list', 'retrieve']:
            return ProfessionalProfile.objects.all()
        # Para acciones protegidas, devolvemos solo el perfil del tutor logueado:
        return ProfessionalProfile.objects.filter(
            tutor__user=self.request.user
        )

    def perform_create(self, serializer):
        # Al crear, asignamos automáticamente el tutor logueado
        tutor = self.request.user.tutor_profile
        serializer.save(tutor=tutor)

    def create(self, request, *args, **kwargs):
        """
        Sobrescribimos create() para devolver un 400 si el tutor ya tiene perfil.
        Así evitamos crear más de un perfil para el mismo tutor.
        """
        tutor = request.user.tutor_profile
        if ProfessionalProfile.objects.filter(tutor=tutor).exists():
            return Response(
                {"detail": "Ya existe un perfil profesional para este tutor."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)