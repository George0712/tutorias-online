from rest_framework import generics, permissions
from users.models import Tutor
from users.serializers.tutor import TutorSerializer

class PublicTutorListView(generics.ListAPIView):
    """
    GET /api/users/public/tutors/  → lista todos los tutores (público)
    """
    queryset = Tutor.objects.select_related('user').all()
    serializer_class = TutorSerializer
    permission_classes = [permissions.AllowAny]

class PublicTutorDetailView(generics.RetrieveAPIView):
    """
    GET /api/users/public/tutors/{pk}/  → detalle de un tutor (público)
    """
    queryset = Tutor.objects.select_related('user').all()
    serializer_class = TutorSerializer
    permission_classes = [permissions.AllowAny]