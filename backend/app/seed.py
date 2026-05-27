from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from app.auth import hash_password
from app.config import settings
from app.database import Base, SessionLocal, engine
from app.models import (
    SCHEMA_VERSION,
    AppMeta,
    Astrologer,
    AstrologerSpeciality,
    AstrologerStatus,
    Consultation,
    ConsultationStatus,
    ConsultationType,
    OnlineStatus,
    PujaBooking,
    PujaBookingStatus,
    User,
    UserRole,
)
from app.seed_data import ASTROLOGER_SEED_ROWS
from app.services.astrologer_crud import add_default_availability


def _get_schema_version(db: Session) -> int:
    row = db.get(AppMeta, "schema_version")
    if not row:
        return 0
    try:
        return int(row.value)
    except ValueError:
        return 0


def _set_schema_version(db: Session, version: int) -> None:
    row = db.get(AppMeta, "schema_version")
    if row:
        row.value = str(version)
    else:
        db.add(AppMeta(key="schema_version", value=str(version)))


def _seed_astrologers(db: Session) -> Astrologer:
    first: Astrologer | None = None
    for row in ASTROLOGER_SEED_ROWS:
        astro = Astrologer(
            legacy_id=row["legacy_id"],
            slug=row["slug"],
            name=row["name"],
            specialty=row["specialty"],
            title=row["title"],
            tagline=row["tagline"],
            bio=row["bio"],
            bio_long=row["bio_long"],
            price_per_minute_paise=row["price_per_minute"] * 100,
            rating_avg=row["rating_avg"],
            review_count=row["review_count"],
            consultation_count=row["consultation_count"],
            experience_years=row["experience_years"],
            languages=row["languages"],
            avatar_url=row["avatar_url"],
            portrait_url=row["portrait_url"],
            online_status=OnlineStatus(row["online_status"]),
            verified=True,
            status=AstrologerStatus.active,
        )
        db.add(astro)
        db.flush()
        for i, spec in enumerate(row["specialities"]):
            db.add(
                AstrologerSpeciality(
                    astrologer_id=astro.id,
                    title=spec["title"],
                    description=spec["description"],
                    sort_order=i,
                )
            )
        add_default_availability(db, astro.id)
        if first is None:
            first = astro
    db.flush()
    return first  # type: ignore[return-value]


def _seed_users_and_demo_data(db: Session, linked_astro: Astrologer) -> None:
    admin = User(
        email="admin@astronext.ai",
        password_hash=hash_password("admin123"),
        name="Platform Admin",
        role=UserRole.admin,
    )
    astro_user = User(
        email="astrologer@astronext.ai",
        password_hash=hash_password("astro123"),
        name=linked_astro.name,
        role=UserRole.astrologer,
    )
    customer = User(
        email="customer@astronext.ai",
        password_hash=hash_password("customer123"),
        name="Demo Customer",
        role=UserRole.customer,
    )
    db.add_all([admin, astro_user, customer])
    db.flush()

    linked_astro.user_id = astro_user.id
    db.flush()

    now = datetime.now(timezone.utc)
    consultations = [
        Consultation(
            astrologer_id=linked_astro.id,
            customer_name="Rahul Sharma",
            customer_email="rahul@example.com",
            consultation_type=ConsultationType.chat,
            scheduled_at=now + timedelta(hours=2),
            duration_minutes=30,
            amount_paise=linked_astro.price_per_minute_paise * 30,
            status=ConsultationStatus.scheduled,
            notes="Career transition guidance",
        ),
        Consultation(
            astrologer_id=linked_astro.id,
            customer_name="Priya Mehta",
            customer_email="priya@example.com",
            consultation_type=ConsultationType.video,
            scheduled_at=now + timedelta(days=1),
            duration_minutes=45,
            amount_paise=linked_astro.price_per_minute_paise * 45,
            status=ConsultationStatus.scheduled,
        ),
        Consultation(
            astrologer_id=linked_astro.id,
            customer_name="Amit Verma",
            customer_email="amit@example.com",
            consultation_type=ConsultationType.call,
            scheduled_at=now - timedelta(days=1),
            duration_minutes=30,
            amount_paise=linked_astro.price_per_minute_paise * 30,
            status=ConsultationStatus.completed,
        ),
    ]
    db.add_all(consultations)

    pujas = [
        PujaBooking(
            devotee_name="Ananya Das",
            puja_name="Satyanarayan Puja",
            scheduled_date="2026-05-28",
            amount_paise=510000,
            status=PujaBookingStatus.confirmed,
        ),
        PujaBooking(
            devotee_name="Karthik Rao",
            puja_name="Rudrabhishek",
            scheduled_date="2026-06-02",
            amount_paise=750000,
            status=PujaBookingStatus.pending,
        ),
    ]
    db.add_all(pujas)


def seed_database() -> None:
    Base.metadata.create_all(bind=engine)
    if not settings.seed_demo_data:
        return

    db = SessionLocal()
    try:
        version = _get_schema_version(db)
        if version < SCHEMA_VERSION:
            if settings.allow_destructive_schema_reset:
                db.close()
                Base.metadata.drop_all(bind=engine)
                Base.metadata.create_all(bind=engine)
                db = SessionLocal()
            _set_schema_version(db, SCHEMA_VERSION)
            db.commit()
        elif db.query(User).first():
            return

        primary = _seed_astrologers(db)
        _seed_users_and_demo_data(db, primary)
        _set_schema_version(db, SCHEMA_VERSION)
        db.commit()
    finally:
        db.close()
