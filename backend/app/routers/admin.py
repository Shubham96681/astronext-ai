from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_roles
from app.models import Astrologer, AstrologerStatus, Consultation, PujaBooking, User, UserRole
from app.schemas import AdminDashboardResponse, PujaBookingOut, StatCard
from app.schemas.astrologer import ConsultationOut
from app.services.astrologer_mapper import astrologer_to_list_item

router = APIRouter(prefix="/admin", tags=["admin"])


def _format_inr(paise: int) -> str:
    return f"₹{paise / 100:,.0f}"


@router.get("/dashboard", response_model=AdminDashboardResponse)
def admin_dashboard(
    _: User = Depends(require_roles(UserRole.admin, UserRole.ops)),
    db: Session = Depends(get_db),
):
    total_consultations = db.query(func.count(Consultation.id)).scalar() or 0
    total_pujas = db.query(func.count(PujaBooking.id)).scalar() or 0
    total_astrologers = (
        db.query(func.count(Astrologer.id)).filter(Astrologer.status == AstrologerStatus.active).scalar() or 0
    )
    from app.models import ConsultationStatus

    consultation_revenue = (
        db.query(func.coalesce(func.sum(Consultation.amount_paise), 0))
        .filter(Consultation.status == ConsultationStatus.completed)
        .scalar()
        or 0
    )

    stats = [
        StatCard(label="Consultation Revenue", value=_format_inr(consultation_revenue), change="+12%", trend="up"),
        StatCard(label="Consultations", value=str(total_consultations), change="+8%", trend="up"),
        StatCard(label="Puja Bookings", value=str(total_pujas), change="+3%", trend="up"),
        StatCard(label="Active Astrologers", value=str(total_astrologers), trend="neutral"),
        StatCard(label="Products", value="Shopify", trend="neutral"),
    ]

    recent_consultations = db.query(Consultation).order_by(Consultation.scheduled_at.desc()).limit(8).all()
    recent_pujas = db.query(PujaBooking).order_by(PujaBooking.created_at.desc()).limit(6).all()
    astrologers = (
        db.query(Astrologer)
        .filter(Astrologer.status == AstrologerStatus.active)
        .order_by(Astrologer.name)
        .all()
    )

    return AdminDashboardResponse(
        stats=stats,
        recent_consultations=[ConsultationOut.model_validate(c) for c in recent_consultations],
        recent_puja_bookings=[PujaBookingOut.model_validate(p) for p in recent_pujas],
        astrologers=[astrologer_to_list_item(a) for a in astrologers],
    )
