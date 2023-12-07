from django.urls import path
from .views import productView, PrdDetailView
from .views import EditReviewGoodToBadView

urlpatterns = [
    path('product_list/', productView.as_view(), name='product_list'),
    path('product_detail/', PrdDetailView.as_view(), name='product_detail'),
    path('product_detail/edit_reviews', EditReviewGoodToBadView.as_view(), name='edit_reviews'),
]
