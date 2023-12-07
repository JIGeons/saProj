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
        return Response(product_data, status=status.HTTP_200_OK)

class PrdDetailView(APIView):
    def get(self, request, *arg, **kwargs):
        prd_id = self.request.GET.get('prdid')

        product_data = Product.objects.get(id=prd_id)
        product_serializer = ProductSerializer(product_data, many=False)

        product_review_data = Review.objects.filter(prd_id=prd_id)
        prd_review_serializer = ReviewSerializer(product_review_data, many=True)

        #print(prd_review_serializer)

        response_data = {
            'product': product_serializer.data,
            'reviews': prd_review_serializer.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)

# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class EditReviewGoodToBadView(View):
    def post(self, request, *args, **kwargs):
        print(request.GET.getlist('selectedReviews'))
        print(request.GET.getitem('productId'))
        try:
            selected_reviews = request.POST.getlist('selectedReviews')
            response_data = {'message': '결과: 실패,, 데이터베이스 수정 실패'}
            # Iterate over the list of review IDs
            for review_id in selected_reviews:
                # Retrieve each review from the database
                review = Review.objects.get(id=review_id)
                print('review')
                print(review)
                # Toggle the 'good_or_bad' value
                if review.good_or_bad == '1':
                    review.good_or_bad = '0'
                elif review.good_or_bad == '0':
                    review.good_or_bad = '1'
                review.save()
                response_data = {'message': '결과: 성공!! 리뷰를 수정하였습니다.'}
            return JsonResponse(response_data)
        except Review.DoesNotExist:
            response_data = {'message': '결과: 실패,, 선택한 리뷰 중 일부를 찾을 수 없습니다.'}
            return JsonResponse(response_data, status=404)

