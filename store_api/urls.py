from django.urls import path
from . import views

urlpatterns = [
    # Health check
    path('health', views.health_check, name='api_health'),

    # Products API
    path('products', views.product_list, name='api_products_list'),
    path('products/categories', views.product_categories, name='api_products_categories'),
    path('products/<str:product_id>', views.product_detail, name='api_product_detail'),
    path('products/<str:product_id>/reviews', views.product_reviews, name='api_product_reviews'),

    # Authentication API
    path('auth/register', views.auth_register, name='api_auth_register'),
    path('auth/login', views.auth_login, name='api_auth_login'),
    path('auth/me', views.auth_me, name='api_auth_me'),
    path('auth/profile', views.auth_profile, name='api_auth_profile'),

    # Orders API
    path('orders', views.order_create_or_list, name='api_orders'),
    path('orders/<str:order_id>', views.order_detail, name='api_order_detail'),
]
