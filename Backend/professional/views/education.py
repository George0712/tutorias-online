from rest_framework import viewsets, permissions
from professional.models import Education
from professional.serializers.education import EducationSerializer
from users.models import Tutor

class EducationViewSet(viewsets.ModelViewSet):
    """
    CRUD para Education:
    - list, retrieve: PÚBLICOS (AllowAny)
    - create, update, partial_update, destroy: autenticados (solo tutor dueño)
    """
    serializer_class = EducationSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_tutor(self):
        tutor, _ = Tutor.objects.get_or_create(user=self.request.user)
        return tutor

    def get_queryset(self):
        queryset = Education.objects.all()
        tutor_id = self.request.query_params.get('tutor', None)
        
        if tutor_id:
            queryset = queryset.filter(tutor_id=tutor_id)
        elif self.request.user.is_authenticated:
            queryset = queryset.filter(tutor=self.get_tutor())
            
        return queryset

    def perform_create(self, serializer):
        serializer.save(tutor=self.get_tutor())