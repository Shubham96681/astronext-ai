from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_roles
from app.models import Astrologer, Consultation, ConsultationStatus, OnlineStatus, User, UserRole
from app.schemas import AstrologerDashboardResponse, StatCard
from app.schemas.astrologer import (
    AstrologerAdminOut,
    AvailabilitySlotIn,
    AvailabilitySlotOut,
    ConsultationCreate,
    ConsultationOut,
    OnlineStatusUpdate,
)
from app.models import AvailabilitySlot
from app.services.astrologer_crud import _parse_time, get_astrologer
from app.services.astrologer_mapper import astrologer_to_admin, slot_to_out

router = APIRouter(prefix="/astrologer", tags=["astrologer-portal"])


def _get_astrologer_for_user(user: User, db: Session) -> Astrologer:
    astro = db.query(Astrologer).filter(Astrologer.user_id == user.id).first()
    if not astro:
        raise HTTPException(status_code=404, detail="Astrologer profile not linked to this account")
    return get_astrologer(db, astro.id)


def _format_inr(paise: int) -> str:
    return f"₹{paise / 100:,.0f}"


@router.get("/dashboard", response_model=AstrologerDashboardResponse)
def astrologer_dashboard(
    user: User = Depends(require_roles(UserRole.astrologer)),
    db: Session = Depends(get_db),
):
    astro = _get_astrologer_for_user(user, db)
    now = datetime.now(timezone.utc)

    upcoming = (
        db.query(Consultation)
        .filter(
            Consultation.astrologer_id == astro.id,
            Consultation.status == ConsultationStatus.scheduled,
            Consultation.scheduled_at >= now,
        )
        .order_by(Consultation.scheduled_at.asc())
        .limit(10)
        .all()
    )

    recent = (
        db.query(Consultation)
        .filter(Consultation.astrologer_id == astro.id)
        .order_by(Consultation.scheduled_at.desc())
        .limit(10)
        .all()
    )

    earnings_paise = (
        db.query(func.coalesce(func.sum(Consultation.amount_paise), 0))
        .filter(
            Consultation.astrologer_id == astro.id,
            Consultation.status == ConsultationStatus.completed,
        )
        .scalar()
        or 0
    )

    today_count = (
        db.query(func.count(Consultation.id))
        .filter(
            Consultation.astrologer_id == astro.id,
            Consultation.status == ConsultationStatus.scheduled,
            Consultation.scheduled_at >= now,
        )
        .scalar()
        or 0
    )

    stats = [
        StatCard(label="Today's Sessions", value=str(today_count), trend="neutral"),
        StatCard(label="Total Earnings", value=_format_inr(earnings_paise), change="+18%", trend="up"),
        StatCard(label="Consultations", value=str(astro.consultation_count), trend="neutral"),
        StatCard(label="Rating", value=f"{astro.rating_avg:.2f}", trend="up"),
    ]

    return AstrologerDashboardResponse(
        profile=astrologer_to_admin(astro),
        stats=stats,
        upcoming_consultations=[ConsultationOut.model_validate(c) for c in upcoming],
        recent_consultations=[ConsultationOut.model_validate(c) for c in recent],
    )


@router.get("/profile", response_model=AstrologerAdminOut)
def get_own_profile(
    user: User = Depends(require_roles(UserRole.astrologer)),
    db: Session = Depends(get_db),
):
    return astrologer_to_admin(_get_astrologer_for_user(user, db))


@router.patch("/online", response_model=AstrologerAdminOut)
def update_online_status(
    body: OnlineStatusUpdate,
    user: User = Depends(require_roles(UserRole.astrologer)),
    db: Session = Depends(get_db),
):
    astro = _get_astrologer_for_user(user, db)
    astro.online_status = OnlineStatus(body.online_status)
    db.commit()
    return astrologer_to_admin(get_astrologer(db, astro.id))


@router.get("/availability", response_model=list[AvailabilitySlotOut])
def list_availability(
    user: User = Depends(require_roles(UserRole.astrologer)),
    db: Session = Depends(get_db),
):
    astro = _get_astrologer_for_user(user, db)
    return [slot_to_out(s) for s in astro.availability_slots]


@router.post("/availability", response_model=AvailabilitySlotOut, status_code=201)
def add_availability(
    body: AvailabilitySlotIn,
    user: User = Depends(require_roles(UserRole.astrologer)),
    db: Session = Depends(get_db),
):
    astro = _get_astrologer_for_user(user, db)
    slot = AvailabilitySlot(
        astrologer_id=astro.id,
        day_of_week=body.day_of_week,
        start_time=_parse_time(body.start_time),
        end_time=_parse_time(body.end_time),
        is_active=body.is_active,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot_to_out(slot)


@router.get("/consultations", response_model=list[ConsultationOut])
def list_consultations(
    user: User = Depends(require_roles(UserRole.astrologer)),
    db: Session = Depends(get_db),
):
    astro = _get_astrologer_for_user(user, db)
    rows = (
        db.query(Consultation)
        .filter(Consultation.astrologer_id == astro.id)
        .order_by(Consultation.scheduled_at.desc())
        .limit(50)
        .all()
    )
    return [ConsultationOut.model_validate(c) for c in rows]


@router.post("/consultations", response_model=ConsultationOut, status_code=201)
def create_consultation(
    body: ConsultationCreate,
    user: User = Depends(require_roles(UserRole.astrologer)),
    db: Session = Depends(get_db),
):
    from app.models import ConsultationType

    astro = _get_astrologer_for_user(user, db)
    row = Consultation(
        astrologer_id=astro.id,
        customer_name=body.customer_name,
        customer_email=body.customer_email,
        consultation_type=ConsultationType(body.consultation_type),
        scheduled_at=body.scheduled_at,
        duration_minutes=body.duration_minutes,
        amount_paise=astro.price_per_minute_paise * body.duration_minutes,
        notes=body.notes,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return ConsultationOut.model_validate(row)
