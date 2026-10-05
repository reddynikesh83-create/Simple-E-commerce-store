#!/usr/bin/env python
"""
CodeAlpha Simple E-Commerce Store - Django Server Runner
Executes migrations, database auto-seeding, and launches the development server.
"""

import os
import sys

def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'store_backend.settings')

    try:
        import django
        from django.core.management import call_command
    except ImportError:
        print("\n" + "=" * 65)
        print("  ⚠️  Django is not yet installed in this Python environment!")
        print("  Please install it with:")
        print("      pip install -r requirements.txt")
        print("      (or: pip install django)")
        print("=" * 65 + "\n")
        sys.exit(1)

    django.setup()

    print("\n" + "=" * 65)
    print("  🚀 CodeAlpha Simple E-Commerce Store (Django Python Backend)")
    print("=" * 65)

    # 1. Run migrations
    print("\n[1/3] Applying database migrations...")
    try:
        call_command('migrate', interactive=False)
        print("      ✅ Database migrations applied.")
    except Exception as e:
        print(f"      ⚠️  Migration notice: {e}")

    # 2. Seed database
    print("\n[2/3] Checking product catalog seed data...")
    try:
        from store_api.seed_data import seed_database
        from store_api.models import Product
        seed_database()
        total_products = Product.objects.count()
        print(f"      ✅ Product catalog ready ({total_products} products loaded).")
    except Exception as e:
        print(f"      ⚠️  Seed notice: {e}")

    # 3. Launch server
    port = os.environ.get('PORT', '8000')
    print(f"\n[3/3] Starting Django HTTP Server on port {port}...")
    print(f"  🔗 Storefront URL: http://127.0.0.1:{port}/")
    print(f"  🔌 REST API URL:   http://127.0.0.1:{port}/api/products")
    print(f"  🛠️  Django Admin:   http://127.0.0.1:{port}/admin/")
    print("=" * 65 + "\n")

    try:
        call_command('runserver', f'127.0.0.1:{port}', use_reloader=True)
    except KeyboardInterrupt:
        print("\n[INFO] Server stopped by user.")

if __name__ == '__main__':
    main()
