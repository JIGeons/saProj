from django.urls import path
from .views import productView, PrdDetailView
urlpatterns = [
    path('product_list/', productView.as_view(), name='product_list'),
    path('product_detail/', PrdDetailView.as_view(), name='product_detial')

]
