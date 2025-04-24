from django.urls import path
from .views.auth import StudentRegisterView, TutorRegisterView, LoginAPIView

urlpatterns = [
    # Endpoint de registro: POST /api/auth/register/
    path('register/student/', StudentRegisterView.as_view(), name='register-student'),
    path('register/tutor/',   TutorRegisterView.as_view(),   name='register-tutor'),
    path('login/', LoginAPIView.as_view(), name='login'),

]