from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from saApp.models import Product
from .serializer import ProductSerializer

class productView(APIView):
    def get(self, request, *args, **kwargs):
        product_data = Product.objects.all()
        product_serializer = ProductSerializer(product_data, many=True)
        return Response(product_serializer.data, status=status.HTTP_200_OK)


# Create your views here.
