# Generated by Django 4.2.7 on 2023-12-12 09:25

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('userid', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=45)),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email')),
                ('status', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.IntegerField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
