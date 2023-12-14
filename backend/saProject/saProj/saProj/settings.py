"""
Django settings for saProj project.

Generated by 'django-admin startproject' using Django 4.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""
from datetime import timedelta
from pathlib import Path

from celery.schedules import crontab

from . import my_settings

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = True

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = my_settings.SECRET_KEY
DATABASES = my_settings.DATABASES
OPEN_API_KEY = my_settings.API_KEY

# SECURITY WARNING: don't run with debug turned on in production!
# DEBUG = True

# 사용자 모델을 설정
AUTH_USER_MODEL = 'users.User'

ALLOWED_HOSTS = []

# 이메일 백엔드 설정
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# SMTP 서버 설정
EMAIL_HOST = 'smtp.naver.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = my_settings.EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = my_settings.EMAIL_HOST_PASSWORD


# Celery settings
CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'Asia/Seoul'

CELERY_BEAT_SCHEDULE = {
    #'scrapping-task': {
    #    'task': 'saApp.tasks.scrapping_review',    # 작업은 saApp의 tasks.py에 scrapping_review()
    #    'schedule': crontab(minute='59')  # 6의 배수 시간 대 마다 실행
    #},
    'gpt-task': {
        'task': 'saApp.tasks.GPT_Question',    # 작업은 saApp의 tasks.py에 GPT_Question()
        'schedule': crontab(minute='38, 40, 42')  # 6의 배수 시간 대 마다 실행
    }
}

SESSION_ENGINE = 'django.contrib.sessions.backends.db'

LOGIN_URL = '/users/login/'

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # app contain
    'saApp',
    'users',
    'posts',
    # library contain
    'django_celery_beat',
    'django_celery_results',
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework.authtoken',
    'corsheaders',
    'drf_yasg',
]

# REST_FRAMEWORK SETTINGS
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',    # cors관련 추가
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

AUTHENTICATION_CLASSES = [
    'django.contrib.auth.backends.ModelBackend',
]


CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]

CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'access-control-allow-credentials',
    'access-control-allow-origin',
    'access-control-request-method',
    'access-control-request-headers',
    'accept',
    'accept-encoding',
    'accept-language',
    'authorization',
    'connection',
    'content-type',
    'dnt',
    'credentials',
    'host',
    'origin',
    'user-agent',
    'X-CSRFToken',
    'csrftoken',
    'x-requested-with',
]
ROOT_URLCONF = 'saProj.urls'

# react와 django에 csrf 기본 설정값이 다르기 때문에 같게 만들어 줌
CSRF_COOKIE_NAME = 'XSRF-TOKEN'
CSRF_HEADER_NAME = 'X-XSRF-TOKEN'
CSRF_USE_SESSIONS = True
CSRF_COOKIE_SECURE = True

TEMPLATES_DIR = BASE_DIR / "templates"
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATES_DIR],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'saProj.wsgi.application'

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
