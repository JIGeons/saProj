from django.core.paginator import Paginator, EmptyPage
from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from saApp.models import Product, Review
from .serializer import ProductSerializer, ReviewSerializer

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

        product_review_data = Review.objects.filter(prd_id=prd_id).values().order_by('id')
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
            review_data = Review.objects.filter(prd_id=prd_id).values().order_by('id')
        elif state == 'good':
            review_data = Review.objects.filter(prd_id=prd_id).filter(good_or_bad=1).values().order_by('id')
        elif state == 'bad':
            review_data = Review.objects.filter(prd_id=prd_id).filter(good_or_bad=0).values().order_by('id')
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

class DetailPagingDate(APIView):
    def get(self, request):
        prd_id = self.request.GET.get('prdid')
        current_page = self.request.GET.get('page')
        startDate = self.request.GET.get('startDate')
        endDate = self.request.GET.get('endDate')
        reviews = Review.objects.filter(prd_id=prd_id, date__range=[startDate, endDate])
        


# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class EditReviewGoodToBadView(APIView):
    def post(self, request):
        update_GB = request.data.get('selectedReviews')
        prd_id = request.data.get('productId')
        reviews = Review.objects.filter(prd_id=prd_id)
        try:
            response_data = {'message': '결과: 성공,, 데이터베이스 수정 완료'}
            # Iterate over the list of review IDs
            for review_num in update_GB:
                # Retrieve each review from the database
                review = reviews.get(review_num=review_num)
                print('review')
                print(review)
                # Toggle the 'good_or_bad' value
                if review.good_or_bad == '1':
                    review.good_or_bad = '0'
                elif review.good_or_bad == '0':
                    review.good_or_bad = '1'
                review.save()
                response_data = {'message': '결과: 성공!! 리뷰를 수정하였습니다.'}
                return Response(response_data)

        except Review.DoesNotExist:
            response_data = {'message': '결과: 실패,, 선택한 리뷰 중 일부를 찾을 수 없습니다.'}
            return Response(response_data, status=404)
        # return Response({}, status=200)
