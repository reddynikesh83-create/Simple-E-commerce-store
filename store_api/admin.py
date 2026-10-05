from django.contrib import admin
from .models import Product, Review, UserProfile, Order

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'category', 'price', 'original_price', 'stock', 'rating', 'review_count')
    list_filter = ('category', 'rating')
    search_fields = ('title', 'description', 'category')
    inlines = [ReviewInline]

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'product', 'rating', 'review_date', 'created_at')
    list_filter = ('rating', 'review_date')
    search_fields = ('user_name', 'comment', 'product__title')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'email', 'phone', 'role', 'created_at')
    search_fields = ('name', 'email', 'phone')
    list_filter = ('role', 'created_at')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'customer_email', 'total', 'payment_method', 'order_status', 'created_at')
    list_filter = ('order_status', 'payment_status', 'payment_method')
    search_fields = ('id', 'customer_name', 'customer_email', 'shipping_street')
