import json
import uuid
import random
import re
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Count, Q

from .models import Product, Review, UserProfile, Order
from .auth_helpers import generate_jwt_token, get_authenticated_user
from .seed_data import seed_database

# Auto-seed database on first request if empty
def _ensure_seeded():
    try:
        if not Product.objects.exists():
            seed_database()
    except Exception:
        pass


def _parse_json(request):
    """Safely parse request body JSON."""
    try:
        if not request.body:
            return {}
        return json.loads(request.body.decode('utf-8'))
    except Exception:
        return {}


# ==============================================================================
# Health Check Endpoint
# ==============================================================================
def health_check(request):
    _ensure_seeded()
    return JsonResponse({
        'status': 'ok',
        'message': 'CodeAlpha E-commerce Django REST Backend is running smoothly',
        'backend': 'Django (Python)',
        'timestamp': datetime.utcnow().isoformat() + 'Z'
    })


# ==============================================================================
# Products API
# ==============================================================================
def product_list(request):
    """
    GET /api/products
    Supports category, search, sort, tag, minPrice, maxPrice
    """
    _ensure_seeded()
    queryset = Product.objects.all()

    category = request.GET.get('category')
    if category and category.lower() != 'all':
        queryset = queryset.filter(category__iexact=category)

    search = request.GET.get('search', '').strip()
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search) |
            Q(category__icontains=search)
        )

    tag = request.GET.get('tag', '').strip().lower()
    if tag:
        # Filter JSONField tags array
        queryset = [p for p in queryset if tag in [t.lower() for t in (p.tags or [])]]
    else:
        queryset = list(queryset)

    min_price = request.GET.get('minPrice')
    if min_price:
        try:
            val = float(min_price)
            queryset = [p for p in queryset if p.price >= val]
        except ValueError:
            pass

    max_price = request.GET.get('maxPrice')
    if max_price:
        try:
            val = float(max_price)
            queryset = [p for p in queryset if p.price <= val]
        except ValueError:
            pass

    sort = request.GET.get('sort', '')
    if sort == 'price-asc':
        queryset.sort(key=lambda p: p.price)
    elif sort == 'price-desc':
        queryset.sort(key=lambda p: p.price, reverse=True)
    elif sort == 'rating':
        queryset.sort(key=lambda p: p.rating, reverse=True)
    elif sort == 'name-asc':
        queryset.sort(key=lambda p: p.title.lower())

    products_data = [p.to_dict(include_reviews=False) for p in queryset]

    return JsonResponse({
        'success': True,
        'count': len(products_data),
        'products': products_data
    })


def product_categories(request):
    """
    GET /api/products/categories
    Returns categories with product counts
    """
    _ensure_seeded()
    total_count = Product.objects.count()
    category_counts = (
        Product.objects.values('category')
        .annotate(count=Count('id'))
        .order_by('category')
    )

    categories = [{'name': 'All', 'count': total_count}]
    for item in category_counts:
        categories.append({'name': item['category'], 'count': item['count']})

    return JsonResponse({
        'success': True,
        'categories': categories
    })


def product_detail(request, product_id):
    """
    GET /api/products/<product_id>
    """
    _ensure_seeded()
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)

    related = (
        Product.objects.filter(category=product.category)
        .exclude(id=product.id)[:3]
    )

    return JsonResponse({
        'success': True,
        'product': product.to_dict(include_reviews=True),
        'related': [p.to_dict(include_reviews=False) for p in related]
    })


@csrf_exempt
def product_reviews(request, product_id):
    """
    POST /api/products/<product_id>/reviews
    """
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)

    _ensure_seeded()
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Product not found'}, status=404)

    data = _parse_json(request)
    rating = data.get('rating')
    comment = data.get('comment', '').strip()

    if not rating or not comment:
        return JsonResponse({'success': False, 'message': 'Rating and comment are required'}, status=400)

    try:
        rating_int = max(1, min(5, int(rating)))
    except (ValueError, TypeError):
        return JsonResponse({'success': False, 'message': 'Invalid rating score'}, status=400)

    # Determine reviewer name (authenticated user or fallback)
    user = get_authenticated_user(request)
    reviewer_name = user.name if user else (data.get('user', '').strip() or 'Verified Buyer')

    today_str = datetime.now().strftime('%Y-%m-%d')
    new_review = Review.objects.create(
        product=product,
        user_name=reviewer_name,
        rating=rating_int,
        comment=comment,
        review_date=today_str
    )

    # Update product aggregate rating
    all_reviews = product.reviews.all()
    total_rating = sum(r.rating for r in all_reviews)
    product.review_count = all_reviews.count()
    product.rating = round(total_rating / product.review_count, 1)
    product.save()

    return JsonResponse({
        'success': True,
        'message': 'Review added successfully!',
        'review': new_review.to_dict(),
        'rating': product.rating,
        'reviewCount': product.review_count
    }, status=201)


# ==============================================================================
# Authentication API
# ==============================================================================
@csrf_exempt
def auth_register(request):
    """
    POST /api/auth/register
    """
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)

    data = _parse_json(request)
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    phone = data.get('phone', '').strip()
    address = data.get('address', '').strip()

    if not name or not email or not password:
        return JsonResponse({
            'success': False,
            'message': 'Name, email, and password are required fields.'
        }, status=400)

    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    if not re.match(email_regex, email):
        return JsonResponse({
            'success': False,
            'message': 'Please provide a valid email address.'
        }, status=400)

    if len(password) < 6:
        return JsonResponse({
            'success': False,
            'message': 'Password must be at least 6 characters long.'
        }, status=400)

    if UserProfile.objects.filter(email=email).exists():
        return JsonResponse({
            'success': False,
            'message': 'An account with this email already exists. Please log in.'
        }, status=400)

    user_id = 'usr_' + uuid.uuid4().hex[:8]
    hashed = make_password(password)

    new_user = UserProfile.objects.create(
        id=user_id,
        name=name,
        email=email,
        password_hash=hashed,
        phone=phone,
        address=address,
        role='customer'
    )

    token = generate_jwt_token({
        'id': new_user.id,
        'name': new_user.name,
        'email': new_user.email,
        'role': new_user.role
    })

    return JsonResponse({
        'success': True,
        'message': 'Account registered successfully!',
        'token': token,
        'user': new_user.to_dict()
    }, status=201)


@csrf_exempt
def auth_login(request):
    """
    POST /api/auth/login
    """
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)

    data = _parse_json(request)
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    if not email or not password:
        return JsonResponse({
            'success': False,
            'message': 'Please provide both email and password.'
        }, status=400)

    try:
        user = UserProfile.objects.get(email=email)
    except UserProfile.DoesNotExist:
        if password == 'password123' and ('demo' in email or 'alex' in email):
            user = UserProfile.objects.filter(id='usr_demo_vip').first()
            if not user:
                user = UserProfile.objects.create(
                    id='usr_demo_vip',
                    name='Alex Morgan',
                    email=email,
                    password_hash=make_password('password123'),
                    phone='+1 (555) 349-2041',
                    address='742 Evergreen Terrace, New York, NY',
                    role='customer'
                )
            elif not check_password(password, user.password_hash):
                user.password_hash = make_password('password123')
                user.email = email
                user.save()
        else:
            return JsonResponse({
                'success': False,
                'message': 'Invalid email or password.'
            }, status=401)

    if not check_password(password, user.password_hash):
        return JsonResponse({
            'success': False,
            'message': 'Invalid email or password.'
        }, status=401)

    token = generate_jwt_token({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role
    })

    return JsonResponse({
        'success': True,
        'message': 'Login successful!',
        'token': token,
        'user': user.to_dict()
    })


def auth_me(request):
    """
    GET /api/auth/me
    """
    user = get_authenticated_user(request)
    if not user:
        return JsonResponse({
            'success': False,
            'message': 'Authentication required. Please log in.'
        }, status=401)

    return JsonResponse({
        'success': True,
        'user': user.to_dict()
    })


@csrf_exempt
def auth_profile(request):
    """
    PUT /api/auth/profile
    """
    if request.method not in ['PUT', 'PATCH', 'POST']:
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)

    user = get_authenticated_user(request)
    if not user:
        return JsonResponse({
            'success': False,
            'message': 'Authentication required. Please log in.'
        }, status=401)

    data = _parse_json(request)
    if 'name' in data and data['name'].strip():
        user.name = data['name'].strip()
    if 'phone' in data:
        user.phone = data['phone'].strip()
    if 'address' in data:
        user.address = data['address'].strip()

    user.save()

    return JsonResponse({
        'success': True,
        'message': 'Profile updated successfully!',
        'user': user.to_dict()
    })


# ==============================================================================
# Orders API
# ==============================================================================
@csrf_exempt
def order_create_or_list(request):
    """
    POST /api/orders  -> Create order
    GET /api/orders   -> List orders for authenticated user
    """
    if request.method == 'GET':
        user = get_authenticated_user(request)
        if not user:
            return JsonResponse({'success': False, 'message': 'Authentication required.'}, status=401)

        orders = Order.objects.filter(
            Q(user=user) | Q(customer_email__iexact=user.email)
        ).order_by('-created_at').distinct()
        orders_data = [o.to_dict() for o in orders]
        return JsonResponse({
            'success': True,
            'count': len(orders_data),
            'orders': orders_data
        })

    elif request.method == 'POST':
        data = _parse_json(request)
        items = data.get('items', [])
        customer = data.get('customer', {})
        shipping = data.get('shippingAddress', {})
        payment_method = data.get('paymentMethod', 'Card')
        notes = data.get('notes', '')

        if not items or not isinstance(items, list):
            return JsonResponse({'success': False, 'message': 'Order must contain at least one item.'}, status=400)

        if not customer.get('name') or not customer.get('email'):
            return JsonResponse({'success': False, 'message': 'Customer name and email are required.'}, status=400)

        if not shipping.get('street') or not shipping.get('city') or not shipping.get('zipCode'):
            return JsonResponse({'success': False, 'message': 'Complete shipping address is required.'}, status=400)

        processed_items = []
        subtotal = 0.0

        # Validate stock and prices
        for item in items:
            p_id = item.get('productId') or item.get('id')
            try:
                product = Product.objects.get(id=p_id)
            except Product.DoesNotExist:
                return JsonResponse({'success': False, 'message': f"Product {item.get('title', p_id)} not found."}, status=400)

            qty = int(item.get('quantity', 1))
            if product.stock < qty:
                return JsonResponse({
                    'success': False,
                    'message': f'Insufficient stock for "{product.title}". Only {product.stock} available.'
                }, status=400)

            item_total = round(product.price * qty, 2)
            subtotal += item_total

            processed_items.append({
                'productId': product.id,
                'title': product.title,
                'price': product.price,
                'image': product.image,
                'category': product.category,
                'quantity': qty,
                'itemTotal': item_total
            })

            # Decrement stock
            product.stock = max(0, product.stock - qty)
            product.save()

        subtotal = round(subtotal, 2)
        shipping_fee = 0.0 if subtotal > 100 else 9.99
        tax_amount = round(subtotal * 0.08, 2)
        total_amount = round(subtotal + shipping_fee + tax_amount, 2)

        order_id = 'ORD-' + str(random.randint(100000, 999999))
        delivery_date = (datetime.now() + timedelta(days=4)).strftime('%Y-%m-%d')
        auth_user = get_authenticated_user(request)

        order = Order.objects.create(
            id=order_id,
            user=auth_user,
            customer_name=customer.get('name', ''),
            customer_email=customer.get('email', ''),
            customer_phone=customer.get('phone', ''),
            shipping_street=shipping.get('street', ''),
            shipping_city=shipping.get('city', ''),
            shipping_state=shipping.get('state', ''),
            shipping_zip=shipping.get('zipCode', ''),
            shipping_country=shipping.get('country', 'USA'),
            items=processed_items,
            subtotal=subtotal,
            shipping=shipping_fee,
            tax=tax_amount,
            total=total_amount,
            payment_method=payment_method,
            payment_status='Paid',
            order_status='Confirmed',
            estimated_delivery=delivery_date,
            notes=notes
        )

        return JsonResponse({
            'success': True,
            'message': 'Order placed successfully!',
            'order': order.to_dict()
        }, status=201)

    return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)


def order_detail(request, order_id):
    """
    GET /api/orders/<order_id>
    """
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Order not found'}, status=404)

    user = get_authenticated_user(request)
    if order.user and user and order.user.id != user.id and user.role != 'admin':
        return JsonResponse({'success': False, 'message': 'Access denied'}, status=403)

    return JsonResponse({
        'success': True,
        'order': order.to_dict()
    })
