from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field

from app.schemas.astrologer import AstrologerAdminOut, AstrologerListItem, ConsultationOut

RoleLiteral = Literal["customer", "astrologer", "admin", "ops"]


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    role: RoleLiteral
    user_id: int
    name: str
    email: str
    redirect_to: str


class RefreshRequest(BaseModel):
    refresh_token: str


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserOut(BaseModel):
    id: int
    email: str
    name: str
    role: RoleLiteral

    model_config = {"from_attributes": True}


class StatCard(BaseModel):
    label: str
    value: str
    change: str | None = None
    trend: Literal["up", "down", "neutral"] | None = None


class PujaBookingOut(BaseModel):
    id: int
    devotee_name: str
    puja_name: str
    scheduled_date: str
    amount_paise: int
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class AdminDashboardResponse(BaseModel):
    stats: list[StatCard]
    recent_consultations: list[ConsultationOut]
    recent_puja_bookings: list[PujaBookingOut]
    astrologers: list[AstrologerListItem]
    products_note: str = "Product catalog is managed via Shopify."


class AstrologerDashboardResponse(BaseModel):
    profile: AstrologerAdminOut
    stats: list[StatCard]
    upcoming_consultations: list[ConsultationOut]
    recent_consultations: list[ConsultationOut]
