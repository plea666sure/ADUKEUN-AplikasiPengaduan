from django.urls import path
from .views import RegisterView
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
