import enum
from datetime import datetime, time, timezone

from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Integer, String, Text, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

SCHEMA_VERSION = 2


class UserRole(str, enum.Enum):
    customer = "customer"
    astrologer = "astrologer"
    admin = "admin"
    ops = "ops"


class AstrologerStatus(str, enum.Enum):
    pending = "pending"
    active = "active"
    suspended = "suspended"


class OnlineStatus(str, enum.Enum):
    online = "online"
    busy = "busy"
    offline = "offline"


class ConsultationType(str, enum.Enum):
    chat = "chat"
    call = "call"
    video = "video"


class ConsultationStatus(str, enum.Enum):
    scheduled = "scheduled"
    active = "active"
    completed = "completed"
    cancelled = "cancelled"
    no_show = "no_show"


class PujaBookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    completed = "completed"
    cancelled = "cancelled"


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class AppMeta(Base):
    __tablename__ = "app_meta"

    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    value: Mapped[str] = mapped_column(String(255))


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(120))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.customer)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    astrologer: Mapped["Astrologer | None"] = relationship(back_populates="user", uselist=False)


class Astrologer(Base):
    """Full astrologer profile — products/catalog live on Shopify."""

    __tablename__ = "astrologers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), unique=True, nullable=True)
    legacy_id: Mapped[int] = mapped_column(Integer, unique=True, index=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True)

    name: Mapped[str] = mapped_column(String(120))
    specialty: Mapped[str] = mapped_column(String(255))
    title: Mapped[str] = mapped_column(String(255))
    tagline: Mapped[str] = mapped_column(Text)
    bio: Mapped[str] = mapped_column(Text)
    bio_long: Mapped[str] = mapped_column(Text)

    price_per_minute_paise: Mapped[int] = mapped_column(Integer, default=10000)
    rating_avg: Mapped[float] = mapped_column(Float, default=4.9)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    consultation_count: Mapped[int] = mapped_column(Integer, default=0)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    languages: Mapped[str] = mapped_column(String(255), default="Hindi, English")

    avatar_url: Mapped[str] = mapped_column(String(512), default="")
    portrait_url: Mapped[str] = mapped_column(String(512), default="")

    online_status: Mapped[OnlineStatus] = mapped_column(Enum(OnlineStatus), default=OnlineStatus.offline)
    verified: Mapped[bool] = mapped_column(Boolean, default=True)
    status: Mapped[AstrologerStatus] = mapped_column(Enum(AstrologerStatus), default=AstrologerStatus.active)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)

    user: Mapped["User | None"] = relationship(back_populates="astrologer")
    specialities: Mapped[list["AstrologerSpeciality"]] = relationship(
        back_populates="astrologer", cascade="all, delete-orphan", order_by="AstrologerSpeciality.sort_order"
    )
    availability_slots: Mapped[list["AvailabilitySlot"]] = relationship(
        back_populates="astrologer", cascade="all, delete-orphan"
    )
    consultations: Mapped[list["Consultation"]] = relationship(back_populates="astrologer")
    reviews: Mapped[list["AstrologerReview"]] = relationship(back_populates="astrologer", cascade="all, delete-orphan")


class AstrologerSpeciality(Base):
    __tablename__ = "astrologer_specialities"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    astrologer_id: Mapped[int] = mapped_column(ForeignKey("astrologers.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    astrologer: Mapped["Astrologer"] = relationship(back_populates="specialities")


class AvailabilitySlot(Base):
    __tablename__ = "availability_slots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    astrologer_id: Mapped[int] = mapped_column(ForeignKey("astrologers.id", ondelete="CASCADE"), index=True)
    day_of_week: Mapped[int] = mapped_column(Integer)  # 0=Monday … 6=Sunday
    start_time: Mapped[time] = mapped_column(Time)
    end_time: Mapped[time] = mapped_column(Time)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    astrologer: Mapped["Astrologer"] = relationship(back_populates="availability_slots")


class Consultation(Base):
    __tablename__ = "consultations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    astrologer_id: Mapped[int] = mapped_column(ForeignKey("astrologers.id"), index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)

    customer_name: Mapped[str] = mapped_column(String(120))
    customer_email: Mapped[str] = mapped_column(String(255))
    consultation_type: Mapped[ConsultationType] = mapped_column(Enum(ConsultationType), default=ConsultationType.chat)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    duration_minutes: Mapped[int] = mapped_column(Integer, default=30)
    amount_paise: Mapped[int] = mapped_column(Integer)
    status: Mapped[ConsultationStatus] = mapped_column(Enum(ConsultationStatus), default=ConsultationStatus.scheduled)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    channel_ref: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    astrologer: Mapped["Astrologer"] = relationship(back_populates="consultations")
    user: Mapped["User | None"] = relationship()


class AstrologerReview(Base):
    __tablename__ = "astrologer_reviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    astrologer_id: Mapped[int] = mapped_column(ForeignKey("astrologers.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    customer_name: Mapped[str] = mapped_column(String(120))
    rating: Mapped[float] = mapped_column(Float)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    astrologer: Mapped["Astrologer"] = relationship(back_populates="reviews")


class PujaBooking(Base):
    __tablename__ = "puja_bookings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    devotee_name: Mapped[str] = mapped_column(String(120))
    puja_name: Mapped[str] = mapped_column(String(255))
    scheduled_date: Mapped[str] = mapped_column(String(32))
    amount_paise: Mapped[int] = mapped_column(Integer)
    status: Mapped[PujaBookingStatus] = mapped_column(Enum(PujaBookingStatus), default=PujaBookingStatus.pending)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
