from django.urls import path, include
from rest_framework.routers import DefaultRouter
from professional.views import EducationViewSet, SkillViewSet, LanguageViewSet

router = DefaultRouter()
router.register(r'educations', EducationViewSet, basename='educations')
router.register(r'skills',     SkillViewSet,     basename='skills')
router.register(r'languages',  LanguageViewSet,  basename='languages')
urlpatterns = [
    path('', include(router.urls)),
]