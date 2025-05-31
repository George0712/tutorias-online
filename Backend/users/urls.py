from django.urls import path
from .views.auth import StudentRegisterView, TutorRegisterView, LoginAPIView
from .views.user_profile import UserProfileView
from .views.public_tutor import PublicTutorListView, PublicTutorDetailView

urlpatterns = [
    # Endpoint de registro: POST /api/auth/register/
    path('register/student/', StudentRegisterView.as_view(), name='register-student'),
    path('register/tutor/',   TutorRegisterView.as_view(),   name='register-tutor'),
    path('login/', LoginAPIView.as_view(), name='login'),
    # Endpoint de perfil de usuario: GET/PUT /api/auth/profile/user/
    path('profile/user/',     UserProfileView.as_view(),      name='user-profile'),
    # Endpoint de lista de tutores públicos: GET /api/users/public/tutors/
    path('public/tutors/',        PublicTutorListView.as_view(),   name='public-tutor-list'),
    # Endpoint de detalle de tutor público: GET /api/users/public/tutors/{pk}/
    path('public/tutors/<int:pk>/', PublicTutorDetailView.as_view(), name='public-tutor-detail'),

]