# SAProj
Django + Selenium + GPT API를 활용한 상품 리뷰 감성평가 사이트

## 🖥️ 프로젝트 소개
Selenium으로 상품 리뷰를 스크래핑 하고, 해당 리뷰를 GPT API를 활용해 긍정인지, 부정인지 감성 평가하는 사이트 입니다.

## 👪 개발 기간 & 참여 인원
* 23.10.25 수 ~ 23.12.26 화
* 2명 : 최지성, 신지혜
## 💿담당 기능
### 개발자 : 최지성
#### 스크래핑 서비스, 로그인, 회원가입, 관계자 페이지, 이메일 인증, 데이터 페이징, 엑셀 파일 생성&저장, 사용자 update
- Selenium을 사용한 Scrapping Service
- Celery를 활용한 Scrapping & GPT Service를 task로 scheduler에 등록
- DjangoRestFramework를 활용한 로그인, 로그아웃, 회원가입, 관계자 페이지 서비스
- DjangoRestFramework를 활용한 Serializer 생성
- Django.core.mail을 활용한 이메일 인증 서비스
- Django.core.paginator를 활용한 데이터 페이징 처리
- IO module & Pandas를 활용한 엑셀 파일 생성
- HttpResponse로 엑셀 파일을 응답으로 반환
- Django Model을 사용한 사용자 정보 update
- AbstractBaseUser를 상속받아 커스텀 사용자 정의 모델 구현
- showModal을 활용한 엑셀 다운로드 화면 구현
- Blob을 활용한 엑셀 파일 다운로드 구현
- localStorage를 활용한 토큰 유지 기능 구현
### 개발자 : 신지혜
#### GPT 감성 평가 서비스, 상품 목록, 상품 상세, 그래프 표현
- GPT API를 활용한 리뷰 감성 평가
- React & Bootstrap을 활용한 상품 목록, 상품 상세 페이지 구현
- showModal을 활용한 상품 리뷰 요약 구현
- Chart를 활용한 상품 리뷰를 원형 그래프로 표현
- Django Model을 사용한 상품 리뷰 평가 수정
- Input type="date"를 활용한 날짜 검색 기능 구현

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
- Pandas
- Celery `5.3.5`
- Redis `5.0.1`
- MySQL `8.0.34`
#### `Front-end`
- HTML
- JavaScript
- Bootstrap  

## 📑 테이블 구조
### ![테이블 정보](https://github.com/JIGeons/saProj/assets/118729956/1da1c635-4be5-4605-9a51-4031f2dae700)

## 💙 핵심 기능
### 이 서비스의 핵심 기능은 상품 리뷰를 스크래핑하고 GPT에 질문을 해 감성평가를 하는 것 입니다.<br>부가 핵심 기능은 평가한 리뷰에 대해 회의 자료로 사용하기 위하여 그래프화 하고, 엑셀 저장입니다.<br>
### 스크래핑 서비스
![Scrapping_Sequence_Diagram](https://github.com/JIGeons/saProj/assets/118729956/2129aafe-d2ca-41a6-86a1-3a444ec9c3f3)

### GPT 서비스
![GPT-Sequence_Diagram](https://github.com/JIGeons/saProj/assets/118729956/ea9f054a-7b4d-410e-8c09-82a20957741e)

### 상품 상세 페이지
![ProductDetail_Sequence_Diagram](https://github.com/JIGeons/saProj/assets/118729956/65c63c73-d27e-4541-93a0-d95b3e3e015e)

## 🤎 아키텍처도
## 🖤 시스템구성도
