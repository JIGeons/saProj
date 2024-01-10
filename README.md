# SAProj
Django + Selenium + GPT API를 활용한 상품 리뷰 감성평가 사이트

## 🖥️ 프로젝트 소개
Selenium으로 상품 리뷰를 스크래핑 하고, 해당 리뷰를 GPT API를 활용해 긍정인지, 부정인지 감성 평가하는 사이트 입니다.

## 👪 개발 기간 & 참여 인원
* 23.10.25 수 ~ 23.12.26 화
* 2명 : 최지성, 신지혜
## 💿 당당 기능
### 개발자 : 최지성
- Selenium을 사용한 Scrapping Service
- Celery를 활용한 Scrapping & GPT Service를 task로 scheduler에 등록
- DjangoRestFramework를 활용한 로그인, 회원가입, 관계자 페이지 서비스
- Django.core.mail을 활용한 이메일 인증 서비스
- Django.core.paginator를 활용한 데이터 페이징 처리
- IO module & Pandas를 활용한 엑셀 파일 생성
- HttpResponse로 엑셀 파일을 응답으로 반환
- Django Model을 사용한 사용자 정보 update
### 개발자 : 신지혜
- GPT API를 활용한 리뷰 감성 평가
- 

## 💾 사용 기술
#### `IDE`
- PyCharm 2023.2.5
- VSCode
#### `Back-end`
- Python `3.9.13`
- Django `4.2.7`
- Selenium `4.15.2`
- Beautifulsoup `4.12.2`
- Openai `0.28.0`
- Celery `5.3.5`
- Redis `5.0.1`
- MySQL `8.0.34`
#### `Front-end`
- HTML
- JavaScript
- Bootstrap  
