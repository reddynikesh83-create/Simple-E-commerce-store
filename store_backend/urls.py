"""
URL configuration for store_backend.
"""

from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.http import HttpResponse, FileResponse, Http404
import os
import mimetypes

def serve_frontend_index(request):
    """Serve the single-page HTML application from public/index.html."""
    index_file = settings.BASE_DIR / 'public' / 'index.html'
    if index_file.exists():
        with open(index_file, 'r', encoding='utf-8') as f:
            content = f.read()
        return HttpResponse(content, content_type='text/html')
    return HttpResponse("Frontend index.html not found.", status=404)

def serve_public_asset(request, path):
    """Serve static CSS, JS, images from the public/ folder directly."""
    file_path = (settings.BASE_DIR / 'public' / path).resolve()
    # Prevent path traversal
    public_root = (settings.BASE_DIR / 'public').resolve()
    if not str(file_path).startswith(str(public_root)):
        raise Http404("Invalid file path.")

    if file_path.is_file():
        mime_type, _ = mimetypes.guess_type(str(file_path))
        return FileResponse(open(file_path, 'rb'), content_type=mime_type or 'application/octet-stream')
    
    # Fallback to index.html for frontend routing
    return serve_frontend_index(request)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('store_api.urls')),
    path('', serve_frontend_index, name='storefront_index'),
    re_path(r'^(?P<path>.*)$', serve_public_asset, name='storefront_assets'),
]
