
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from booking.models import Booking
from booking.serializer import BookingSerializer

class IsStudent(permissions.BasePermission):
    """
    Permite solo a estudiantes crear reservas.
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'student_profile')

class IsTutor(permissions.BasePermission):
    """
    Permite solo a tutores confirmar o cancelar (acciones futuras).
    """
    def has_permission(self, request, view):
        return hasattr(request.user, 'tutor_profile')

class BookingViewSet(viewsets.ModelViewSet):

    serializer_class   = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsStudent()]
        if self.action in ['update', 'partial_update', 'destroy']:
            # No permitimos editar o borrar con estos métodos normales
            return [permissions.IsAuthenticated(), permissions.IsAdminUser()]
        # list y retrieve: cualquier usuario autenticado
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'student_profile'):
            return Booking.objects.filter(student=user.student_profile)
        if hasattr(user, 'tutor_profile'):
            return Booking.objects.filter(tutor=user.tutor_profile)
        return Booking.objects.none()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsTutor])
    def confirm(self, request, pk=None):
        """
        El tutor autenticado confirma la reserva (status='confirmed').
        URL: POST /api/booking/bookings/{pk}/confirm/
        """
        booking = self.get_object()
        # Verificamos que el tutor dueño sea quien hace la petición
        if booking.tutor.user != request.user:
            return Response({'detail': 'No tienes permiso para confirmar esta reserva.'},
                            status=status.HTTP_403_FORBIDDEN)

        booking.status = Booking.CONFIRMED
        booking.save()
        serializer = self.get_serializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated, IsTutor])
    def cancel(self, request, pk=None):
        """
        El tutor autenticado cancela la reserva (status='canceled').
        URL: POST /api/booking/bookings/{pk}/cancel/
        """
        booking = self.get_object()
        if booking.tutor.user != request.user:
            return Response({'detail': 'No tienes permiso para cancelar esta reserva.'},
                            status=status.HTTP_403_FORBIDDEN)

        booking.status = Booking.CANCELED
        booking.save()
        serializer = self.get_serializer(booking)
        return Response(serializer.data, status=status.HTTP_200_OK)
