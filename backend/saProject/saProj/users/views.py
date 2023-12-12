from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator, EmptyPage
from rest_framework.decorators import permission_classes, authentication_classes
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.mail import send_mail
from django.http import JsonResponse
from django.utils.crypto import get_random_string
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializer import UserSerializer
from rest_framework.authtoken.models import Token

def sendEmail(function, email, name):
    from_email = 'rlrjtlrl2@naver.com'  # 보내는 이메일 주소
    to_email = [email]

    if function == 'signUp':
        verification_code = get_random_string(length=6, allowed_chars='1234567890')
        subject = '회원가입 인증코드'
        message = f'{name}님의 회원가입을 위한 인증코드는 다음과 같습니다. {verification_code}'

        #send_mail(subject, message, from_email, to_email, fail_silently=False)

        return verification_code
    elif function == 'userUpdateApprove':
        subject = '회원가입 승인 완료'
        message = f'{name}님의 회원가입 승인이 완료 되었습니다.\n이제부터 로그인이 가능해집니다.'
    elif function == 'userUpdateReject':
        subject = '회원가입 승인 거절'
        message = f'{name}님의 회원가입 승인이 거절 되었습니다.\n거절 사유는 관리자에게 문의해주세요.'

    send_mail(subject, message, from_email, to_email, fail_silently=False)

class LoginView(APIView):
    def post(self, request):
        userid = request.data.get('userId')
        password = request.data.get('password')
        
        try:
            user = authenticate(request, userid=userid, password=password)
        except:
            print("사용자 없음")
            return Response({'message': "해당 사용자가 없습니다."})


        if user is not None:
            # 승인완료 상태
            if user.status == 1:
                login(request, user)

                # 토큰 발급
                token, created = Token.objects.get_or_create(user=user)

                return Response({
                    "success": True,
                    'token': token.key
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

            return Response({'success': True}, status=200)

        except Exception as e:
            print(f"error : {e}")
            return Response({'success': False, 'message': 'signup Failed'}, status=400)

class SendEmailView(APIView):
    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name')

        if name == '':
            return JsonResponse({'success':False, 'error': '이름이 적혀있지 않습니다'}, status=400)
        try:
            print("이메일 : ", email)
            # 이미 가입된 이메일인지 확인
            user = User.objects.get(email=email)
            return JsonResponse({'success':False, 'error': '이미 가입된 이메일입니다.'})
        except User.DoesNotExist:
            # 가입되지 않은 이메일일 경우 인증 코드 생성 및 전송
            verification_code = sendEmail(function='signUp', email=email, name=name)

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

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class getUsersView(APIView):
    def post(self, request):
        user = request.user
        currentPage = self.request.data.get('page')
        state = self.request.data.get('state')

        if state == 'approve':
            users = User.objects.filter(status=0).values().order_by('name')
        elif state == 'user':
            users = User.objects.exclude(userid=user.userid).filter(status=1).values().order_by('name')
        else:
            return Response({"message": "Invalid data."}, status=400)

        paginator = Paginator(users, 10)    # 페이지당 10개의 유저 정보를 보여준다.

        try:
            users_page = paginator.page(currentPage)
        except EmptyPage:
            return Response({'detail': 'Invalid page.'}, status=400)

        response_data = {
            'users': list(users_page),
            'admin': user.name,
            'total': users.count(),
        }

        return Response(response_data, status=200)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class UserUpdate(APIView):
    def post(self, request):
        userid = request.user.userid

        currentPage = request.data.get('page')
        state = request.data.get('state')
        update = request.data.get('update')
        status = False      # 가입 승인, 거절 메일을 보내기 위한 변수 true는 status가 변경 된것이므로 메일을 전송한다.

        for updateUser in update:
            try:
                user_update = User.objects.get(userid=updateUser.get('userId'))
                if updateUser.get('status') != None:
                    user_update.status = updateUser.get('status')
                    status = True
                elif updateUser.get('admin') != None:
                    user_update.is_admin = updateUser.get('admin')

                user_update.save()

                # status가 변경이 되었을때만 메일 전송
                #if status and user_update.status == 1:
                    #sendEmail(function='userUpdateApprove', email=user_update.email, name=user_update.name)
                #elif status and user_update.status == 2:
                    #sendEmail(function='userUpdateReject', email=user_update.email, name=user_update.name)
            except Exception as e:
                print(f"error : {e}")
                return Response({"message": "user status update failed"}, status=400)

        if state == 'approve':
            users = User.objects.filter(status=0).values().order_by('name')
        elif state == 'user':
            users = User.objects.exclude(userid=userid).filter(status=1).values().order_by('name')
        else:
            return Response({"message": "Invalid data."}, status=400)

        paginator = Paginator(users, 10)  # 페이지당 10개의 유저 정보를 보여준다.

        try:
            users_page = paginator.page(currentPage)
        except EmptyPage:
            return Response({'detail': 'Invalid page.'}, status=400)

        response_data = {
            'users': list(users_page),
            'admin': request.user.name,
            'total': users.count(),
        }

        return Response(response_data, status=200)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class getUserData(APIView):
    def get(self, request):
        user = UserSerializer(request.user)

        return Response({'user': user.data}, status=200)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class LogoutView(APIView):
    def get(self, request):
        logout(request)

        return Response({'success': 'logout complete'}, status=200)

# Create your views here.
