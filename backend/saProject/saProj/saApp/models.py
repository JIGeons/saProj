from django.db import models

class Product(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=45)
    price = models.IntegerField()
    src = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'product'


class Review(models.Model):
    prd = models.ForeignKey(Product, models.DO_NOTHING)
    review_num = models.IntegerField()
    title = models.CharField(max_length=200)
    user_name = models.CharField(max_length=45, blank=True, null=True)
    count = models.IntegerField(blank=True, null=True)
    content = models.TextField()
    date = models.DateField()
    good_or_bad = models.CharField(max_length=5, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'review'



# Create your models here.
