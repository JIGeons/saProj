# absolute_import는 celery.py 모듈이 라이브러리들과 충돌하여 문제가 발생하지 않도록 돕는다.
from __future__ import absolute_import, unicode_literals
import os

from celery import Celery

# 커맨드라인에서 셀러리를 편하게 사용하기 위해 'DJANGO_SETTINGS_MODULE' 환경 변수를 기본 값으로 설정
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'saProj.settings')

# 프로젝트 이름으로 celery 생성
app = Celery('saProj')

# settings에 지정한 celery값으로 app 설정
# namespace='CELERY'는 settings에서 'CELERY_'로 시작하는 값들만 celery의 config로 인식
app.config_from_object('django.conf:settings', namespace='CELERY')

# 장고 앱 설정에서 task를 자동으로 불러온다.
app.autodiscover_tasks()