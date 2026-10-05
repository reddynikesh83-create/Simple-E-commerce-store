from django.db import models

class UserProfile(models.Model):
    """Registered customer user profile and credentials."""
    id = models.CharField(max_length=64, primary_key=True)
    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    phone = models.CharField(max_length=50, blank=True, default='')
    address = models.TextField(blank=True, default='')
    role = models.CharField(max_length=20, default='customer')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'store_users'
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'

    def __str__(self):
        return f"{self.name} ({self.email})"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'role': self.role,
            'createdAt': self.created_at.isoformat() if self.created_at else ''
        }


class Product(models.Model):
    """Store catalog product."""
    id = models.CharField(max_length=64, primary_key=True)
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, db_index=True)
    price = models.FloatField()
    original_price = models.FloatField(null=True, blank=True)
    rating = models.FloatField(default=5.0)
    review_count = models.IntegerField(default=0)
    stock = models.IntegerField(default=10)
    image = models.TextField()
    description = models.TextField()
    detailed_description = models.TextField(blank=True, default='')
    specs = models.JSONField(default=dict, blank=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'store_products'
        verbose_name = 'Product'
        verbose_name_plural = 'Products'

    def __str__(self):
        return f"{self.title} (${self.price})"

    def to_dict(self, include_reviews=True):
        reviews_data = []
        if include_reviews:
            reviews_data = [r.to_dict() for r in self.reviews.all().order_by('-created_at')]

        return {
            'id': self.id,
            'title': self.title,
            'category': self.category,
            'price': float(self.price),
            'originalPrice': float(self.original_price) if self.original_price is not None else None,
            'rating': float(self.rating),
            'reviewCount': int(self.review_count),
            'stock': int(self.stock),
            'image': self.image,
            'description': self.description,
            'detailedDescription': self.detailed_description,
            'specs': self.specs if isinstance(self.specs, dict) else {},
            'tags': self.tags if isinstance(self.tags, list) else [],
            'reviews': reviews_data
        }


class Review(models.Model):
    """Customer product reviews."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=150)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    review_date = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'store_reviews'
        verbose_name = 'Review'
        verbose_name_plural = 'Reviews'

    def __str__(self):
        return f"{self.user_name} - {self.product.title} ({self.rating}★)"

    def to_dict(self):
        return {
            'user': self.user_name,
            'rating': self.rating,
            'comment': self.comment,
            'date': self.review_date
        }


class Order(models.Model):
    """Processed customer order."""
    id = models.CharField(max_length=64, primary_key=True)
    user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    customer_name = models.CharField(max_length=150)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=50, blank=True, default='')
    shipping_street = models.CharField(max_length=255)
    shipping_city = models.CharField(max_length=100)
    shipping_state = models.CharField(max_length=100, blank=True, default='')
    shipping_zip = models.CharField(max_length=30)
    shipping_country = models.CharField(max_length=50, default='USA')
    items = models.JSONField(default=list)
    subtotal = models.FloatField(default=0.0)
    shipping = models.FloatField(default=0.0)
    tax = models.FloatField(default=0.0)
    total = models.FloatField(default=0.0)
    payment_method = models.CharField(max_length=50, default='Card')
    payment_status = models.CharField(max_length=50, default='Paid')
    order_status = models.CharField(max_length=50, default='Confirmed')
    estimated_delivery = models.CharField(max_length=50, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'store_orders'
        ordering = ['-created_at']
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return f"Order {self.id} - ${self.total} ({self.customer_name})"

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user.id if self.user else None,
            'customer': {
                'name': self.customer_name,
                'email': self.customer_email,
                'phone': self.customer_phone,
            },
            'shippingAddress': {
                'street': self.shipping_street,
                'city': self.shipping_city,
                'state': self.shipping_state,
                'zipCode': self.shipping_zip,
                'country': self.shipping_country
            },
            'items': self.items if isinstance(self.items, list) else [],
            'subtotal': round(self.subtotal, 2),
            'shipping': round(self.shipping, 2),
            'tax': round(self.tax, 2),
            'total': round(self.total, 2),
            'paymentMethod': self.payment_method,
            'paymentStatus': self.payment_status,
            'orderStatus': self.order_status,
            'estimatedDelivery': self.estimated_delivery,
            'notes': self.notes,
            'createdAt': self.created_at.isoformat() if self.created_at else ''
        }
