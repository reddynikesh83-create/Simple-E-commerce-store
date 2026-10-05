import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=255)),
                ('category', models.CharField(db_index=True, max_length=100)),
                ('price', models.FloatField()),
                ('original_price', models.FloatField(blank=True, null=True)),
                ('rating', models.FloatField(default=5.0)),
                ('review_count', models.IntegerField(default=0)),
                ('stock', models.IntegerField(default=10)),
                ('image', models.TextField()),
                ('description', models.TextField()),
                ('detailed_description', models.TextField(blank=True, default='')),
                ('specs', models.JSONField(blank=True, default=dict)),
                ('tags', models.JSONField(blank=True, default=list)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
                'db_table': 'store_products',
            },
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password_hash', models.CharField(max_length=255)),
                ('phone', models.CharField(blank=True, default='', max_length=50)),
                ('address', models.TextField(blank=True, default='')),
                ('role', models.CharField(default='customer', max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'User Profile',
                'verbose_name_plural': 'User Profiles',
                'db_table': 'store_users',
            },
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_now_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=150)),
                ('rating', models.IntegerField(default=5)),
                ('comment', models.TextField()),
                ('review_date', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='store_api.product')),
            ],
            options={
                'verbose_name': 'Review',
                'verbose_name_plural': 'Reviews',
                'db_table': 'store_reviews',
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.CharField(max_length=64, primary_key=True, serialize=False)),
                ('customer_name', models.CharField(max_length=150)),
                ('customer_email', models.EmailField(max_length=254)),
                ('customer_phone', models.CharField(blank=True, default='', max_length=50)),
                ('shipping_street', models.CharField(max_length=255)),
                ('shipping_city', models.CharField(max_length=100)),
                ('shipping_state', models.CharField(blank=True, default='', max_length=100)),
                ('shipping_zip', models.CharField(max_length=30)),
                ('shipping_country', models.CharField(default='USA', max_length=50)),
                ('items', models.JSONField(default=list)),
                ('subtotal', models.FloatField(default=0.0)),
                ('shipping', models.FloatField(default=0.0)),
                ('tax', models.FloatField(default=0.0)),
                ('total', models.FloatField(default=0.0)),
                ('payment_method', models.CharField(default='Card', max_length=50)),
                ('payment_status', models.CharField(default='Paid', max_length=50)),
                ('order_status', models.CharField(default='Confirmed', max_length=50)),
                ('estimated_delivery', models.CharField(blank=True, default='', max_length=50)),
                ('notes', models.TextField(blank=True, default='')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='orders', to='store_api.userprofile')),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
                'db_table': 'store_orders',
                'ordering': ['-created_at'],
            },
        ),
    ]
