from django.urls import path
from posts.views import productView

urlpatterns = [
    path('product_list/', productView.as_view(), name='product_list'),
]
