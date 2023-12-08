from django.urls import path
from .views import productView, PrdDetailView, DetailPaging, ExcelDownload,GetPrdId


urlpatterns = [
    path('product_list/', productView.as_view(), name='product_list'),
    path('product_detail/', PrdDetailView.as_view(), name='product_detial'),
    path('product_detail/paging/', DetailPaging.as_view(), name=('detail_paging')),
    path('exceldownload/', ExcelDownload.as_view(), name=('excel_download')),
    path('prdId/', GetPrdId.as_view(), name=('get_prd_id'))
]
