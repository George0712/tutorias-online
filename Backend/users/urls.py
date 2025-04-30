from django.urls import path
from .views.auth import StudentRegisterView, TutorRegisterView, LoginAPIView
from .views.user_profile import UserProfileView
from .views.tutor_profile import TutorProfileView

urlpatterns = [
    # Endpoint de registro: POST /api/auth/register/
    path('register/student/', StudentRegisterView.as_view(), name='register-student'),
    path('register/tutor/',   TutorRegisterView.as_view(),   name='register-tutor'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('profile/tutor/', TutorProfileView.as_view(), name='tutor-profile'), 
    path('profile/user/',     UserProfileView.as_view(),      name='user-profile')

]