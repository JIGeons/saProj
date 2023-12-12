from rest_framework import serializers
from saApp.models import Product, Review

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'src', 'count', 'good', 'bad')

class ProductViewSerializer(serializers.ModelSerializer):
    recent_review_num = serializers.IntegerField()  # 또는 필요한 필드 타입으로 변경

    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'src', 'count', 'good', 'bad', 'recent_review_num')


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('id', 'review_num', 'user_name', 'title', 'content', 'date', 'good_or_bad', 'prd_id')