from app.models import Astrologer, OnlineStatus
from app.schemas.astrologer import (
    AstrologerAdminOut,
    AstrologerListItem,
    AstrologerPublic,
    AstrologerSpecialityOut,
    AvailabilitySlotOut,
)


def _is_online(status: OnlineStatus) -> bool:
    return status in (OnlineStatus.online, OnlineStatus.busy)


def astrologer_to_public(astro: Astrologer) -> AstrologerPublic:
    return AstrologerPublic(
        id=astro.legacy_id,
        slug=astro.slug,
        name=astro.name,
        specialty=astro.specialty,
        title=astro.title,
        tagline=astro.tagline,
        bio=astro.bio,
        bio_long=astro.bio_long,
        rating=astro.rating_avg,
        reviews=astro.review_count,
        consultations=astro.consultation_count,
        exp=astro.experience_years,
        price_per_minute=astro.price_per_minute_paise // 100,
        online=_is_online(astro.online_status),
        languages=astro.languages,
        specialities=[
            AstrologerSpecialityOut(title=s.title, description=s.description) for s in astro.specialities
        ],
        avatar=astro.avatar_url,
        portrait=astro.portrait_url,
        verified=astro.verified,
        status=astro.status.value,
        online_status=astro.online_status.value,
    )


def astrologer_to_list_item(astro: Astrologer) -> AstrologerListItem:
    pub = astrologer_to_public(astro)
    return AstrologerListItem(
        id=pub.id,
        slug=pub.slug,
        name=pub.name,
        specialty=pub.specialty,
        title=pub.title,
        rating=pub.rating,
        reviews=pub.reviews,
        consultations=pub.consultations,
        exp=pub.exp,
        price_per_minute=pub.price_per_minute,
        online=pub.online,
        languages=pub.languages,
        avatar=pub.avatar,
        portrait=pub.portrait,
        verified=pub.verified,
    )


def astrologer_to_admin(astro: Astrologer) -> AstrologerAdminOut:
    return AstrologerAdminOut(
        id=astro.id,
        legacy_id=astro.legacy_id,
        slug=astro.slug,
        user_id=astro.user_id,
        name=astro.name,
        specialty=astro.specialty,
        title=astro.title,
        tagline=astro.tagline,
        bio=astro.bio,
        bio_long=astro.bio_long,
        price_per_minute_paise=astro.price_per_minute_paise,
        rating_avg=astro.rating_avg,
        review_count=astro.review_count,
        consultation_count=astro.consultation_count,
        experience_years=astro.experience_years,
        languages=astro.languages,
        avatar_url=astro.avatar_url,
        portrait_url=astro.portrait_url,
        online_status=astro.online_status.value,
        verified=astro.verified,
        status=astro.status.value,
        specialities=[
            AstrologerSpecialityOut(title=s.title, description=s.description) for s in astro.specialities
        ],
        availability_slots=[slot_to_out(s) for s in astro.availability_slots],
    )


def slot_to_out(slot) -> AvailabilitySlotOut:
    return AvailabilitySlotOut(
        id=slot.id,
        day_of_week=slot.day_of_week,
        start_time=slot.start_time.strftime("%H:%M"),
        end_time=slot.end_time.strftime("%H:%M"),
        is_active=slot.is_active,
    )
