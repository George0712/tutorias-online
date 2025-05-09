from django.urls import path, include
from rest_framework.routers import DefaultRouter
from professional.views.education import EducationViewSet
from professional.views.skill import SkillViewSet
from professional.views.language import LanguageViewSet
from professional.views.profile import ProfessionalProfileViewSet

router = DefaultRouter()
router.register(r'educations', EducationViewSet, basename='educations')
router.register(r'skills',     SkillViewSet,     basename='skills')
router.register(r'languages',  LanguageViewSet,  basename='languages')
router.register(r'profile',   ProfessionalProfileViewSet, basename='profile')
urlpatterns = [
    path('', include(router.urls)),
]