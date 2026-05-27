from datetime import datetime, timedelta, timezone
import base64
import hashlib
from typing import Any, Literal

import bcrypt
from jose import JWTError, jwt

from app.config import settings
from app.models import User, UserRole

ALGORITHM = "HS256"
TokenType = Literal["access", "refresh"]
_PW_PREFIX = "sha256$"


def _bcrypt_safe_secret(password: str) -> str:
    """
    Convert arbitrary-length password to a bcrypt-safe deterministic secret.
    bcrypt truncates at 72 bytes; this avoids runtime errors and preserves entropy.
    """
    digest = hashlib.sha256(password.encode("utf-8")).digest()
    encoded = base64.urlsafe_b64encode(digest).decode("ascii").rstrip("=")
    return f"{_PW_PREFIX}{encoded}"


def hash_password(password: str) -> str:
    secret = _bcrypt_safe_secret(password).encode("utf-8")
    return bcrypt.hashpw(secret, bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    if not hashed:
        return False

    hashed_bytes = hashed.encode("utf-8")
    normalized = _bcrypt_safe_secret(plain).encode("utf-8")

    # Primary path: new hashes use normalized secret.
    try:
        if bcrypt.checkpw(normalized, hashed_bytes):
            return True
    except ValueError:
        return False
    except Exception:
        return False

    # Backward compatibility for legacy rows hashed from raw password input.
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed_bytes)
    except ValueError:
        return False
    except Exception:
        return False


def _build_payload(
    *,
    user: User,
    token_type: TokenType,
    expires_delta: timedelta,
) -> dict[str, Any]:
    now = datetime.now(timezone.utc)
    return {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role.value,
        "type": token_type,
        "iat": now,
        "exp": now + expires_delta,
    }


def create_access_token(user: User) -> str:
    payload = _build_payload(
        user=user,
        token_type="access",
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def create_refresh_token(user: User) -> str:
    payload = _build_payload(
        user=user,
        token_type="refresh",
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )
    return jwt.encode(payload, settings.jwt_secret, algorithm=ALGORITHM)


def create_token_pair(user: User) -> tuple[str, str]:
    return create_access_token(user), create_refresh_token(user)


def decode_token(token: str) -> dict[str, Any] | None:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[ALGORITHM])
    except JWTError:
        return None


def validate_token(token: str, *, expected_type: TokenType) -> dict[str, Any]:
    payload = decode_token(token)
    if not payload:
        raise ValueError("Invalid or expired token")
    if payload.get("type") != expected_type:
        raise ValueError(f"Expected {expected_type} token")
    if "sub" not in payload:
        raise ValueError("Invalid token payload")
    return payload


def role_redirect(role: UserRole) -> str:
    if role == UserRole.admin or role == UserRole.ops:
        return "/dashboard/admin"
    if role == UserRole.astrologer:
        return "/dashboard/astrologer"
    return "/"
