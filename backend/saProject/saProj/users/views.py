from django.contrib.auth import authenticate, login
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken

from .serializer import UserSerializer
from .models import User

class LoginView(APIView):
    def post(self, request):
        userid = request.data.get('userId')
        password = request.data.get('password')

        user = authenticate(username=userid, password=password)

        print(userid, password)

        if user is not None:
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'message': "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class SignUpView(generics.CreateAPIView):
    def post(self, request):
        print(generics.CreateAPIView)
        queryset = User.objects.all()
        serializer_class = UserSerializer
        permission_classes = [permissions.AllowAny]

# Create your views here.
