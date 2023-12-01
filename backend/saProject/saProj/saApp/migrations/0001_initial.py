# Generated by Django 4.2.7 on 2023-11-30 08:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('price', models.IntegerField()),
                ('src', models.TextField()),
            ],
            options={
                'db_table': 'product',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('review_num', models.IntegerField()),
                ('user_name', models.CharField(blank=True, max_length=45, null=True)),
                ('title', models.CharField(max_length=200)),
                ('count', models.IntegerField(blank=True, null=True)),
                ('content', models.TextField()),
                ('date', models.DateField()),
                ('good_or_bad', models.CharField(blank=True, max_length=5, null=True)),
            ],
            options={
                'db_table': 'review',
                'managed': False,
            },
        ),
    ]
