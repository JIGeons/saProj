from django.db import models

class Product(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    src = models.TextField()

class Review(models.Model):
    review_num = models.IntegerField(primary_key=True)
    prd = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_reviews')
    user_name = models.CharField(max_length=45, blank=True, null=True)
    title = models.CharField(max_length=200)
    content = models.TextField()
    date = models.DateField()
    good_or_bad = models.CharField(max_length=5, blank=True, null=True)


# Create your models here.
