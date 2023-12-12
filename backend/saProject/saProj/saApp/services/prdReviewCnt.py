from ..models import Product, Review


def reviewCount():
    products = Product.objects.all()

    for product in products:
        product.count = Review.objects.filter(prd_id=product.id).count()
        product.good = Review.objects.filter(prd_id=product.id).filter(good_or_bad=1).count()
        product.bad = Review.objects.filter(prd_id=product.id).filter(good_or_bad=0).count()

        product.save()

