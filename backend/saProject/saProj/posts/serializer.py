from rest_framework import serializers
from saApp.models import Product, Review

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'src']

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'prd_id', 'review_num', 'user_name', 'title', 'count', 'content', 'date', 'good_or_bad']