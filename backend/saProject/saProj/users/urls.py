from django.urls import path
from .views import LoginView, SignUpView, SendEmailView, findIdView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('send_code/', SendEmailView.as_view(), name='sendCode'),
    path('findID/', findIdView.as_view(), name="findID")
]
