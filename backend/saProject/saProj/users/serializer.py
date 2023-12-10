from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        user = User.objects.create_user(
            userid=validated_data['userid'],
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user
    class Meta:
        model = User
        fields = ('userid', 'password', 'name', 'email', 'status', 'is_admin')