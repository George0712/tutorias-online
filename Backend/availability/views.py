from rest_framework import viewsets, permissions
from availability.models import TimeSlot
from availability.serializer import TimeSlotSerializer

class TimeSlotViewSet(viewsets.ModelViewSet):
    """
    - list, retrieve: cualquiera (AllowAny) puede ver las franjas de un tutor.
    - create, update, destroy: solo el tutor autenticado.
    """
    serializer_class = TimeSlotSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Para list/retrieve (público), devolvemos todas las franjas. 
        if self.action in ['list', 'retrieve']:
            return TimeSlot.objects.select_related('tutor').all()
        # Para create/update/delete, devolvemos solo las franjas del tutor logueado:
        return TimeSlot.objects.filter(tutor=self.request.user.tutor_profile)

    def perform_create(self, serializer):
        # Asignamos automáticamente el tutor logueado:
        serializer.save(tutor=self.request.user.tutor_profile)