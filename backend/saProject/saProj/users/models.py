from django.contrib.auth.base_user import BaseUserManager, AbstractBaseUser
from django.db import models

# 유저를 생성할 때 사용하는 헬퍼(Helper) 클래스, 실제 모델은 AbstractBaseUser을 상속받아 생성하는 클래스
class UserManager(BaseUserManager):
    def create_user(self, userid, name, email, password=None):
        if not id:
            raise ValueError('must have user ID')

        user = self.model(
            userid=userid,
            name=name,
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, userid, name, email, password):
        user = self.create_user(
            userid=userid,
            name=name,
            email=email,
            password=password,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    userid = models.CharField(primary_key=True, max_length=50)
    name = models.CharField(max_length=45)
    email = models.EmailField(
        verbose_name='email',
        max_length=255,
        unique=True
    )
    status = models.IntegerField(default=0)
    # is_active, is_admin 장고의 유저 모델의 필수 코드
    is_active = models.BooleanField(default=True)
    is_admin = models.IntegerField(default=False)

    # 헬퍼 클래스 사용
    objects = UserManager()

    # username필드를 'userid'로 사용 설정
    USERNAME_FIELD = 'userid'
    REQUIRED_FIELDS = ['name', 'email']
    def __str__(self):
        return self.userid

    # True를 반환하여 권한이 있음을 알림 obj를 반환하는 경우 해당 obj로 사용 권한을 확인하는 절차가 필요
    def has_perm(self, perm, obj=None):
        return True

    # True를 반환하여 주어진 앱(App)의 모델(Model)에 접근 가능하도록 한다.
    def has_module_perms(self, app_label):
        return True

    # True가 반환 되면 장고의 관리자 화면에 로그인 할 수 있다.
    @property
    def is_staff(self):
        return self.is_admin

# Create your models here.
