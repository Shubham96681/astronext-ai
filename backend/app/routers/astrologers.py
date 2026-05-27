from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.astrologer_crud import get_astrologer_by_legacy_id, get_astrologer_by_slug, list_astrologers
from app.services.astrologer_mapper import astrologer_to_list_item, astrologer_to_public
from app.schemas.astrologer import AstrologerListResponse, AstrologerPublic

router = APIRouter(prefix="/astrologers", tags=["astrologers"])


@router.get("", response_model=AstrologerListResponse)
def list_public_astrologers(
    online: bool | None = Query(default=None),
    db: Session = Depends(get_db),
):
    rows = list_astrologers(db, online=online)
    data = [astrologer_to_public(a) for a in rows]
    return AstrologerListResponse(data=data, meta={"total": len(data)})


@router.get("/{slug_or_id}", response_model=AstrologerPublic)
def get_public_astrologer(slug_or_id: str, db: Session = Depends(get_db)):
    astro = get_astrologer_by_slug(db, slug_or_id)
    if not astro and slug_or_id.isdigit():
        astro = get_astrologer_by_legacy_id(db, int(slug_or_id))
    if not astro:
        raise HTTPException(status_code=404, detail="Astrologer not found")
    return astrologer_to_public(astro)
