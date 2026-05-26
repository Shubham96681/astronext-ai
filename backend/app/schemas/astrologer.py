from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class AstrologerSpecialityOut(BaseModel):
    title: str
    description: str


class AstrologerSpecialityIn(BaseModel):
    title: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1)


class AstrologerListItem(BaseModel):
    id: int
    slug: str
    name: str
    specialty: str
    title: str
    rating: float
    reviews: int
    consultations: int
    exp: int
    price_per_minute: int
    online: bool
    languages: str
    avatar: str
    portrait: str
    verified: bool


class AstrologerPublic(AstrologerListItem):
    tagline: str
    bio: str
    bio_long: str
    specialities: list[AstrologerSpecialityOut]
    status: str
    online_status: str


class AstrologerListResponse(BaseModel):
    data: list[AstrologerPublic]
    meta: dict


class AvailabilitySlotOut(BaseModel):
    id: int
    day_of_week: int
    start_time: str
    end_time: str
    is_active: bool


class AvailabilitySlotIn(BaseModel):
    day_of_week: int = Field(ge=0, le=6)
    start_time: str = Field(pattern=r"^\d{2}:\d{2}$")
    end_time: str = Field(pattern=r"^\d{2}:\d{2}$")
    is_active: bool = True


class AstrologerAdminOut(BaseModel):
    id: int
    legacy_id: int
    slug: str
    user_id: int | None
    name: str
    specialty: str
    title: str
    tagline: str
    bio: str
    bio_long: str
    price_per_minute_paise: int
    rating_avg: float
    review_count: int
    consultation_count: int
    experience_years: int
    languages: str
    avatar_url: str
    portrait_url: str
    online_status: str
    verified: bool
    status: str
    specialities: list[AstrologerSpecialityOut]
    availability_slots: list[AvailabilitySlotOut] = []

    model_config = {"from_attributes": True}


class AstrologerCreate(BaseModel):
    legacy_id: int | None = None
    slug: str | None = None
    name: str = Field(min_length=2, max_length=120)
    specialty: str
    title: str
    tagline: str
    bio: str
    bio_long: str
    price_per_minute: int = Field(ge=1)
    rating_avg: float = Field(ge=0, le=5, default=4.9)
    review_count: int = Field(ge=0, default=0)
    consultation_count: int = Field(ge=0, default=0)
    experience_years: int = Field(ge=0, default=0)
    languages: str = "Hindi, English"
    avatar_url: str = ""
    portrait_url: str = ""
    online_status: Literal["online", "busy", "offline"] = "offline"
    verified: bool = True
    status: Literal["pending", "active", "suspended"] = "active"
    specialities: list[AstrologerSpecialityIn] = []
    user_email: str | None = None


class AstrologerUpdate(BaseModel):
    name: str | None = None
    specialty: str | None = None
    title: str | None = None
    tagline: str | None = None
    bio: str | None = None
    bio_long: str | None = None
    price_per_minute: int | None = Field(default=None, ge=1)
    rating_avg: float | None = Field(default=None, ge=0, le=5)
    review_count: int | None = Field(default=None, ge=0)
    consultation_count: int | None = Field(default=None, ge=0)
    experience_years: int | None = Field(default=None, ge=0)
    languages: str | None = None
    avatar_url: str | None = None
    portrait_url: str | None = None
    online_status: Literal["online", "busy", "offline"] | None = None
    verified: bool | None = None
    status: Literal["pending", "active", "suspended"] | None = None
    specialities: list[AstrologerSpecialityIn] | None = None


class OnlineStatusUpdate(BaseModel):
    online_status: Literal["online", "busy", "offline"]


class ConsultationOut(BaseModel):
    id: int
    astrologer_id: int
    customer_name: str
    customer_email: str
    consultation_type: str
    scheduled_at: datetime
    duration_minutes: int
    amount_paise: int
    status: str
    notes: str | None = None

    model_config = {"from_attributes": True}


class ConsultationCreate(BaseModel):
    customer_name: str
    customer_email: str
    consultation_type: Literal["chat", "call", "video"] = "chat"
    scheduled_at: datetime
    duration_minutes: int = Field(ge=5, le=180)
    notes: str | None = None


class ReviewOut(BaseModel):
    id: int
    customer_name: str
    rating: float
    comment: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
