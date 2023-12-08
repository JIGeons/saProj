import openpyxl
import pandas as pd

from django.core.paginator import Paginator, EmptyPage
from django.http import HttpResponse
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.db.models import Q
from django.http import HttpResponse

from saApp.models import Product, Review
from .serializer import ProductSerializer, ReviewSerializer

def excel_download(reviews, start, end):
    print(f"reviews = {reviews}, start = {start}, end = {end}")

    review_data = Review.objects.filter(prd_id__in=reviews)

    print(review_data)

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
    # 리뷰 데이터를 DataFrame으로 변환
    df = pd.DataFrame.from_records(review_data)

    df = df.rename(columns={'review_num': '리뷰 번호', 'prd_id': '상품 번호', 'user_name': '유저 이름', 'title': '제목', 'content': '내용', 'date': '작성 날짜', 'good_or_bad': '긍정/부정'})

    print(df)

    # 엑셀 파일 생성
    excel = pd.ExcelWriter('드시모네_리뷰_데이터.xlsx', engine='xlsxwriter')

    # 각 상품 별로 다른 워크시트에 데이터 작성
    for prd_id, group_df in df.groupby('상품 번호'):
        # utf-8-sig는 Excel에서 한글이 제대로 인식되도록 하는 인코딩
        group_df.to_excel(excel, sheet_name=f'{Product.objects.get(id=prd_id).name}', index=False)

    excel.save()

    # 'rb'는 파일을 이진 모드로 읽기 위한 옵션
    with open('드시모네_리뷰_데이터.xlsx', 'rb') as file:
        response = HttpResponse(file.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = 'attachment; filename=드시모네_리뷰_데이터.xlsx'

    return response

class productView(APIView):
    def get(self, request, *args, **kwargs):
        products = Product.objects.all()
        product_data = []

        for product in products:
            # 각 제품에 대한 리뷰 갯수
            review_count = Review.objects.filter(prd_id=product.id).count()
            review_good = Review.objects.filter(prd_id=product.id, good_or_bad=1).count()
            review_bad = Review.objects.filter(prd_id=product.id, good_or_bad=0).count()

            # ProductSerializer를 사용하여 데이터 직렬화
            product_serializer = ProductSerializer(product)
            review_data = {
                'review_count': review_count,
                'review_good': review_good,
                'review_bad': review_bad
            }

            # 시리얼라이즈된 데이터를 product_data 리스트에 추가
            product_data.append({
                **product_serializer.data,
                **review_data
            })
            # product_serializer와 review_data는 두 개의 딕셔너리이다.
            # '**'를 사용하여 이 두 딕셔너리를 하나로 합친다. (딕셔너리 언패킹)

        return Response(product_data, status=status.HTTP_200_OK)

class PrdDetailView(APIView):
    def get(self, request, *arg, **kwargs):
        prd_id = self.request.GET.get('prdid')

        product_data = Product.objects.get(id=prd_id)
        product_serializer = ProductSerializer(product_data, many=False)

        product_review_data = Review.objects.filter(prd_id=prd_id).values().order_by('review_num')
        good = product_review_data.filter(good_or_bad=1).count()
        bad = product_review_data.filter(good_or_bad=0).count()

        current_page = 1

        paginator = Paginator(product_review_data, 10)

        try:
            review_page = paginator.page(current_page)
        except EmptyPage:
            return Response({'detail': 'Invalid page.'}, status=400)

        response_data = {
            'review_page': list(review_page),
            'product': product_serializer.data,
            'total': product_review_data.count(),
            'good': good,
            'bad': bad
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
            review_data = Review.objects.filter(prd_id=prd_id).values().order_by('review_num')
        elif state == 'good':
            review_data = Review.objects.filter(prd_id=prd_id).filter(good_or_bad=1).values().order_by('review_num')
        elif state == 'bad':
            review_data = Review.objects.filter(prd_id=prd_id).filter(good_or_bad=0).values().order_by('review_num')
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


# Create your views here.
