from django.contrib.auth import authenticate, login
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken

from .serializer import UserSerializer
from .models import User

class LoginView(APIView):
    def post(self, request):
        print("전송")
        userid = request.data.get('userId')
        password = request.data.get('password')

        user = authenticate(request, username=userid, password=password)

        print(f"userid: {userid} password: {password}")

        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': "Invalid credentials"}
                            , status=status.HTTP_401_UNAUTHORIZED)

class SignUpView(APIView):
    def post(self, request):
        userid = request.data.get('userId')
        password1 = request.data.get('password1')
        password2 = request.data.get('password2')
        name = request.data.get('name')
        email = request.data.get('email')

        print(userid, password1, name, email)
        return render(request, "/users/signup/")

# Create your views here.
