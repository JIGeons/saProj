import openpyxl
from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from saApp.models import Product, Review
from .serializer import ProductSerializer, ReviewSerializer

def excel_download(reviews, start, end):
    wb = openpyxl.Workbook()

    # 각 상품에 대한 시트 생성
    for review in reviews:
        # 시트 이름을 상품이름으로 설정
        sheet_name = Product.objects.get(id=review)
        ws = wb.create_sheet(title=sheet_name.name)

        # 헤더 추가
        headers = [field.name for field in Review._meta.fields]
        ws.append(headers)

        review_data = Review.objects.filter(prd_id=review)

        if start != 'all':
            # 리뷰 데이터 가져오기
            review_data = review_data.filter(date__range=[start, end]).values().all()


        # 데이터 추가
        for row in review_data:
            ws.append([getattr(row, header) for header in headers])

    # 처음에 자동으로 생성된 기본 시트 삭제
    del wb['Sheet']

    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=드시모네_상품_리뷰.xlsx'
    wb.save(response)

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
        start = request.data.get('startdate')
        end = request.data.get('enddate')
        download = request.data.get('download')

        print(start, end, download)

        response = excel_download(download, start, end)

        return response


# Create your views here.
