from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from saApp.models import Product, Review
from .serializer import ProductSerializer, ReviewSerializer

class productView(APIView):
    def get(self, request, *args, **kwargs):
        product_data = Product.objects.all()
        product_serializer = ProductSerializer(product_data, many=True)
        return Response(product_serializer.data, status=status.HTTP_200_OK)

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
