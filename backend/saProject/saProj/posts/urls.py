from django.urls import path
from .views import productView, PrdDetailView, DetailPaging, ExcelDownload


urlpatterns = [
    path('product_list/', productView.as_view(), name='product_list'),
    path('product_detail/', PrdDetailView.as_view(), name='product_detial'),
    path('product_detail/paging/', DetailPaging.as_view(), name=('detail_paging')),
    path('exceldownload/', ExcelDownload.as_view(), name=('excel_download'))
]
