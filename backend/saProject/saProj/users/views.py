from django.contrib.auth import authenticate, login
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils.crypto import get_random_string
from .models import User
from .serializer import UserSerializer
from rest_framework.authtoken.models import Token
from django.utils import timezone

class LoginView(APIView):
    def post(self, request):
        print("전송")
        userid = request.data.get('userId')
        password = request.data.get('password')
        
        try:
            user = authenticate(userid=userid, password=password)
        except:
            print("사용자 없음")

        print(f"userid: {userid} password: {password}")
        print(user)

        if user is not None:
            # 승인완료 상태
            if user.status == 1:

                # 기존 토큰이 있다면 삭제
                Token.objects.filter(user=user).delete()

                login(request, user)
                token = Token.objects.create(user=user)
                token.expires = timezone.now() + timezone.timedelta(hours=6)
                token.save()
                return Response({
                    "success": True,
                    "token": token.key
                }, status=status.HTTP_200_OK)
            # 승인 대기 상태
            elif user.status == 0:
                return Response({
                    "success": False,
                    "status": user.status,
                    "message": "아직 승인 되지 않은 id입니다."
                })
            # 승인 거절 상태
            elif user.status == 2:
                return Response({
                    "success": False,
                    "status": user.status,
                    "message": "승인 거절 상태 입니다. 관리자에게 문의하세요."
                })
        else:
            return Response({'message': "Invalid credentials"})

class SignUpView(APIView):
    def post(self, request):
        userid = request.data.get('userId')
        password = request.data.get('password')
        name = request.data.get('name')
        email = request.data.get('email')
        print(userid, password, name, email)

        try:
            user_create = UserSerializer().create({
                'userid': userid,
                'name': name,
                'email': email,
                'password': password
            })

            return Response({'success': True})
        except :
            return Response({'success': False, 'message': 'signup Failed'}, status=400)

class SendEmailView(APIView):
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        try:
            print("이메일 : ", email)
            # 이미 가입된 이메일인지 확인
            user = User.objects.get(email=email)
            return JsonResponse({'success':False, 'error': '이미 가입된 이메일입니다.'})
        except User.DoesNotExist:
            # 가입되지 않은 이메일일 경우 인증 코드 생성 및 전송
            verification_code = get_random_string(length=6, allowed_chars='1234567890')
            subject = '회원가입 인증코드'
            message = f'회원가입을 위한 인증코드는 다음과 같습니다. {verification_code}'
            from_email = 'rlrjtlrl2@naver.com' # 보내는 이메일 주소
            to_email = [email]

            send_mail(subject, message, from_email, to_email, fail_silently=False)

            return JsonResponse({'success': True, 'verification_code': verification_code})

class findIdView(APIView):
    def post(self, request):
        userId = request.data.get('userid')

        try:
            user = User.objects.get(userid=userId)
            return JsonResponse({'success': False})
        except User.DoesNotExist:
            # 가입 되어 있지 않은 아이디일 경우 success response
            return JsonResponse({'success': True})
# Create your views here.
