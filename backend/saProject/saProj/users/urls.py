from django.urls import path
from .views import LoginView, SignUpView, SendEmailView, findIdView, getUsersView, UserUpdate, getUserData, LogoutView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('send_code/', SendEmailView.as_view(), name='sendCode'),
    path('findID/', findIdView.as_view(), name="findID"),
    path('getUsers/', getUsersView.as_view(), name="getUsers"),
    path('save/', UserUpdate.as_view(), name='userUpdate'),
    path('adminName/', getUserData.as_view(), name='getUserData'),
    path('logout/', LogoutView.as_view(), name='logout')
]
