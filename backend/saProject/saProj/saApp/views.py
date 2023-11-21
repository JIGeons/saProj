from django.shortcuts import render

from .models import Product

def product_page(request):
    product_data = Product.objects.all()
    return render(request, 'product.html', {'products': product_data})


# Create your views here.
