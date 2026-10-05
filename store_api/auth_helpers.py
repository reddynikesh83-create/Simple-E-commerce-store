from __future__ import annotations
import hmac
import hashlib
import json
import base64
import time
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
from .models import UserProfile

JWT_SECRET = getattr(settings, 'SECRET_KEY', 'codealpha_django_secret_key_2026')

def _b64url_encode(data_bytes: bytes) -> str:
    """Base64 URL-safe encode without trailing padding."""
    return base64.urlsafe_b64encode(data_bytes).decode('utf-8').rstrip('=')

def _b64url_decode(data_str: str) -> bytes:
    """Base64 URL-safe decode adding padding back."""
    rem = len(data_str) % 4
    if rem > 0:
        data_str += '=' * (4 - rem)
    return base64.urlsafe_b64decode(data_str.encode('utf-8'))

def generate_jwt_token(payload: dict, expires_in_hours: int = 24) -> str:
    """
    Generate an industry-standard signed HS256 JWT token without external dependencies.
    """
    header = {"alg": "HS256", "typ": "JWT"}
    exp_timestamp = int(time.time()) + (expires_in_hours * 3600)
    full_payload = {**payload, "exp": exp_timestamp}

    header_b64 = _b64url_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
    payload_b64 = _b64url_encode(json.dumps(full_payload, separators=(',', ':')).encode('utf-8'))

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    sig = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
    sig_b64 = _b64url_encode(sig)

    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_jwt_token(token: str) -> dict | None:
    """
    Verify signature and expiry of a HS256 JWT token.
    Returns payload dictionary or None if invalid/expired.
    """
    if not token or not isinstance(token, str):
        return None

    parts = token.strip().split('.')
    if len(parts) != 3:
        return None

    header_b64, payload_b64, sig_b64 = parts

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    expected_sig = hmac.new(JWT_SECRET.encode('utf-8'), signing_input, hashlib.sha256).digest()
    expected_sig_b64 = _b64url_encode(expected_sig)

    # Constant-time comparison to prevent timing attacks
    if not hmac.compare_digest(sig_b64, expected_sig_b64):
        return None

    try:
        payload_bytes = _b64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))
        exp = payload.get('exp')
        if exp and int(time.time()) > int(exp):
            return None  # Expired
        return payload
    except Exception:
        return None

def get_authenticated_user(request) -> UserProfile | None:
    """
    Extracts Bearer token from Authorization header and returns UserProfile.
    """
    auth_header = request.headers.get('Authorization') or request.META.get('HTTP_AUTHORIZATION')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None

    token = auth_header.split(' ', 1)[1].strip()
    payload = verify_jwt_token(token)
    if not payload or 'id' not in payload:
        return None

    try:
        return UserProfile.objects.filter(id=payload['id']).first()
    except Exception:
        return None
