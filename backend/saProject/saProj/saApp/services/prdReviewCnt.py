from ..models import Product, Review


def reviewCount():
    products = Product.objects.all()

    for product in products:
        count = Review.objects.filter(prd_id=product.id).count()
        good = Review.objects.filter(prd_id=product.id).filter(good_or_bad=1).count()
        bad = Review.objects.filter(prd_id=product.id).filter(good_or_bad=0).count()

        product.update(count=count, good=good, bad=bad)

