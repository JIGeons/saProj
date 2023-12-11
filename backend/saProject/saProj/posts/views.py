import pandas as pd

from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import render
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.db.models import Q
from django.http import HttpResponse
from django.http import FileResponse
import io
from urllib.parse import quote

from saApp.models import Product, Review
from .serializer import ProductSerializer, ReviewSerializer
from users.serializer import UserSerializer


def excel_download(reviews, start, end):
    print(f"reviews = {reviews}, start = {start}, end = {end}")

    review_data = Review.objects.filter(prd_id__in=reviews)

    print(review_data.count())

    # 리뷰 데이터 가져오기
    if start == '':
        if end == '':
            review_data = review_data.values()
        else :
            review_data = review_data.filter(Q(date__lte=end)).values().all()
    else:
        if end == '':
            review_data = review_data.filter(Q(date__gte=start)).values().all()
        else:
            review_data = review_data.filter(date__range=[start, end]).values().all()

    if review_data.count() == 0:
        return 'empty data'

    total = review_data.count()
    good = review_data.filter(good_or_bad=1).count()
    bad = review_data.filter(good_or_bad=0).count()

    summary_df = pd.DataFrame({'총 리뷰 갯수': [total], '긍정 리뷰 갯수': [good], '부정 리뷰 갯수': [bad]})
    # 리뷰 데이터를 DataFrame으로 변환
    df = pd.DataFrame.from_records(review_data)
    df = df.drop(columns=['id'])

    # good_or_bad 열 값 변경
    df['good_or_bad'] = df['good_or_bad'].map({1: '긍정', 0:'부정'})

    df = df.rename(columns={'review_num': '리뷰 번호', 'prd_id': '상품 번호', 'user_name': '유저 이름', 'title': '제목', 'content': '내용', 'date': '작성 날짜', 'good_or_bad': '긍정/부정'})

    print(df)

    # 엑셀 파일 생성
    excel_data = io.BytesIO()
    excel = pd.ExcelWriter('드시모네_리뷰_데이터.xlsx', engine='xlsxwriter')

    # 각 상품 별로 다른 워크시트에 데이터 작성
    for prd_id, group_df in df.groupby('상품 번호'):
        # utf-8-sig는 Excel에서 한글이 제대로 인식되도록 하는 인코딩
        group_df.to_excel(excel, sheet_name=f'{Product.objects.get(id=prd_id).name}', index=False)

    excel.close()
    excel_data.seek(0)

    with open('드시모네_리뷰_데이터.xlsx', 'rb') as file:
        response = HttpResponse(file.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=드시모네_리뷰_데이터.xlsx'

        print(response)

    return response

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class productView(APIView):
    def get(self, request, *args, **kwargs):
        user = UserSerializer(request.user)
        products = Product.objects.all()
        product_serializer = ProductSerializer(products, many=True)

        return Response({'products': product_serializer.data, 'user': user.data}, status=status.HTTP_200_OK)

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class PrdDetailView(APIView):
    def get(self, request, *arg, **kwargs):
        prd_id = self.request.GET.get('prdid')

        product_data = Product.objects.get(id=prd_id)
        product_serializer = ProductSerializer(product_data, many=False)

        print("오류가 어디서 나는 것인가?")
        product_review_data = Review.objects.filter(prd_id=prd_id).values().order_by('id')
        print("여기인가?")

        current_page = 1

        paginator = Paginator(product_review_data, 10)

        try:
            review_page = paginator.page(current_page)
        except EmptyPage:
            return Response({'detail': 'Invalid page.'}, status=400)

        response_data = {
            'review_page': list(review_page),
            'product': product_serializer.data,
            'total': product_data.count,
            'good': product_data.good,
            'bad': product_data.bad
        }

        return Response(response_data, status=status.HTTP_200_OK)

class DetailPaging(APIView):
    def get(self, request):
        print("안녕")
        prd_id = self.request.GET.get('prdid')
        current_page = self.request.GET.get('page')
        state = self.request.GET.get('state')

        print(state)

        if state == 'all':
            review_data = Review.objects.filter(prd_id=prd_id)
        elif state == 'good':
            review_data = Review.objects.filter(prd_id=prd_id, good_or_bad=1)
        elif state == 'bad':
            review_data = Review.objects.filter(prd_id=prd_id, good_or_bad=2)
        else:
            return Response({'detail': 'Invalid state.'}, status=400)

        paginator = Paginator(review_data, 10)

        try:
            review_page = paginator.page(current_page)
        except EmptyPage:
            return Response({'detail': 'Invalid page.'}, status=400)

        return Response({
            "reviews": list(review_page),
            "total": review_data.count()
        }, status=200)

class ExcelDownload(APIView):
    def post(self, request):
        start = request.data.get('start')
        end = request.data.get('end')
        download = request.data.get('download')

        print(start, end, download)

        response = excel_download(download, start, end)

        return response

class GetPrdId(APIView):
    def get(self, request):
        prd_id = request.GET.get('prdId')

        return Response({'prdName': Product.objects.get(id=prd_id).name}, status=200)


# Create your views here.
