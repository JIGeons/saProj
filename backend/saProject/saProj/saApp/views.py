from django.shortcuts import render

from .models import Product, Review


def product_page(request):
    product_data = Product.objects.all()
    return render(request, 'product.html', {'products': product_data})

def product_detail_page(request):
    productId = request.GET.get("prdid")
    product_data = Product.object.filter(id=productId)
    goodReviews = Review.objects.filter(product_id=productId, good_or_bad=1)
    badReviews = Review.objects.filter(product_id=productId, good_or_bad=0)

    context = {
        "product": product_data,
        "good": goodReviews.count(),
        "bad": badReviews.count(),
    }
    return render(request, 'product_detail.html', context)
