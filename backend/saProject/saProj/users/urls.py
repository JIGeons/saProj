from django.urls import path
from .views import LoginView, SignUpView, SendEmailView, findIdView, getUsersView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('send_code/', SendEmailView.as_view(), name='sendCode'),
    path('findID/', findIdView.as_view(), name="findID"),
    path('getUsers/', getUsersView.as_view(), name="getUsers"),
    path('getUsersPaging/', getUsersView.as_view(), name="getUsers")
]
