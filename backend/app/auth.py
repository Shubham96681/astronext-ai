from datetime import datetime, timedelta, timezone
from typing import Any, Literal

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.models import User, UserRole

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"
TokenType = Literal["access", "refresh"]


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


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
