from datetime import time

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models import (
    Astrologer,
    AstrologerSpeciality,
    AstrologerStatus,
    AvailabilitySlot,
    OnlineStatus,
)
from app.schemas.astrologer import AstrologerCreate, AstrologerSpecialityIn, AstrologerUpdate


def _slug_from_name(name: str, legacy_id: int) -> str:
    base = name.lower().replace("'", "")
    for ch in " .,":
        base = base.replace(ch, "-")
    while "--" in base:
        base = base.replace("--", "-")
    suffix = f"ab{legacy_id:08x}"
    return f"{base.strip('-')}-{suffix}"


def _parse_time(value: str) -> time:
    h, m = value.split(":")
    return time(int(h), int(m))


def apply_specialities(astro: Astrologer, items: list[AstrologerSpecialityIn], db: Session) -> None:
    db.query(AstrologerSpeciality).filter(AstrologerSpeciality.astrologer_id == astro.id).delete()
    for i, item in enumerate(items):
        db.add(
            AstrologerSpeciality(
                astrologer_id=astro.id,
                title=item.title,
                description=item.description,
                sort_order=i,
            )
        )


def _next_legacy_id(db: Session) -> int:
    current = db.query(func.max(Astrologer.legacy_id)).scalar()
    return (current or 300) + 1


def create_astrologer(db: Session, body: AstrologerCreate) -> Astrologer:
    legacy_id = body.legacy_id or _next_legacy_id(db)
    slug = body.slug or _slug_from_name(body.name, legacy_id)

    astro = Astrologer(
        legacy_id=legacy_id,
        slug=slug,
        name=body.name,
        specialty=body.specialty,
        title=body.title,
        tagline=body.tagline,
        bio=body.bio,
        bio_long=body.bio_long,
        price_per_minute_paise=body.price_per_minute * 100,
        rating_avg=body.rating_avg,
        review_count=body.review_count,
        consultation_count=body.consultation_count,
        experience_years=body.experience_years,
        languages=body.languages,
        avatar_url=body.avatar_url,
        portrait_url=body.portrait_url,
        online_status=OnlineStatus(body.online_status),
        verified=body.verified,
        status=AstrologerStatus(body.status),
    )
    db.add(astro)
    db.flush()
    apply_specialities(astro, body.specialities, db)
    db.commit()
    db.refresh(astro)
    return get_astrologer(db, astro.id)


def update_astrologer(db: Session, astro: Astrologer, body: AstrologerUpdate) -> Astrologer:
    data = body.model_dump(exclude_unset=True)
    specialities = data.pop("specialities", None)
    if "price_per_minute" in data:
        data["price_per_minute_paise"] = data.pop("price_per_minute") * 100
    if "online_status" in data:
        data["online_status"] = OnlineStatus(data.pop("online_status"))
    if "status" in data:
        data["status"] = AstrologerStatus(data.pop("status"))

    for key, value in data.items():
        setattr(astro, key, value)

    if specialities is not None:
        apply_specialities(astro, specialities, db)

    db.commit()
    return get_astrologer(db, astro.id)


def get_astrologer(db: Session, astro_id: int) -> Astrologer:
    return (
        db.query(Astrologer)
        .options(joinedload(Astrologer.specialities), joinedload(Astrologer.availability_slots))
        .filter(Astrologer.id == astro_id)
        .first()
    )


def get_astrologer_by_slug(db: Session, slug: str, *, active_only: bool = True) -> Astrologer | None:
    q = (
        db.query(Astrologer)
        .options(joinedload(Astrologer.specialities), joinedload(Astrologer.availability_slots))
        .filter(Astrologer.slug == slug)
    )
    if active_only:
        q = q.filter(Astrologer.status == AstrologerStatus.active)
    return q.first()


def get_astrologer_by_legacy_id(db: Session, legacy_id: int, *, active_only: bool = True) -> Astrologer | None:
    q = (
        db.query(Astrologer)
        .options(joinedload(Astrologer.specialities), joinedload(Astrologer.availability_slots))
        .filter(Astrologer.legacy_id == legacy_id)
    )
    if active_only:
        q = q.filter(Astrologer.status == AstrologerStatus.active)
    return q.first()


def list_astrologers(
    db: Session,
    *,
    online: bool | None = None,
    status: AstrologerStatus | None = AstrologerStatus.active,
) -> list[Astrologer]:
    q = db.query(Astrologer).options(joinedload(Astrologer.specialities)).order_by(Astrologer.legacy_id)
    if status is not None:
        q = q.filter(Astrologer.status == status)
    if online is True:
        q = q.filter(Astrologer.online_status.in_([OnlineStatus.online, OnlineStatus.busy]))
    elif online is False:
        q = q.filter(Astrologer.online_status == OnlineStatus.offline)
    return q.all()


def add_default_availability(db: Session, astro_id: int) -> None:
    """Weekday 9–18 and Saturday 10–14 slots for consultations."""
    defaults = [
        (0, "09:00", "18:00"),
        (1, "09:00", "18:00"),
        (2, "09:00", "18:00"),
        (3, "09:00", "18:00"),
        (4, "09:00", "18:00"),
        (5, "10:00", "14:00"),
    ]
    for day, start, end in defaults:
        db.add(
            AvailabilitySlot(
                astrologer_id=astro_id,
                day_of_week=day,
                start_time=_parse_time(start),
                end_time=_parse_time(end),
            )
        )
