from django.urls import path, include
from rest_framework.routers import DefaultRouter
from availability.views import TimeSlotViewSet

router = DefaultRouter()
router.register(r'timeslots', TimeSlotViewSet, basename='timeslots')

urlpatterns = [
    path('', include(router.urls)),
]