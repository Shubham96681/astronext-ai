from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_roles
from app.models import Astrologer, AstrologerStatus, User, UserRole
from app.schemas.astrologer import AstrologerAdminOut, AstrologerCreate, AstrologerUpdate
from app.services.astrologer_crud import create_astrologer, get_astrologer, list_astrologers, update_astrologer
from app.services.astrologer_mapper import astrologer_to_admin

router = APIRouter(prefix="/admin/astrologers", tags=["admin-astrologers"])


@router.get("", response_model=list[AstrologerAdminOut])
def admin_list_astrologers(
    _: User = Depends(require_roles(UserRole.admin, UserRole.ops)),
    db: Session = Depends(get_db),
    status: str | None = None,
):
    stat = AstrologerStatus(status) if status else None
    rows = list_astrologers(db, status=stat, online=None)
    return [astrologer_to_admin(a) for a in rows]


@router.post("", response_model=AstrologerAdminOut, status_code=201)
def admin_create_astrologer(
    body: AstrologerCreate,
    _: User = Depends(require_roles(UserRole.admin, UserRole.ops)),
    db: Session = Depends(get_db),
):
    astro = create_astrologer(db, body)
    return astrologer_to_admin(astro)


@router.get("/{astro_id}", response_model=AstrologerAdminOut)
def admin_get_astrologer(
    astro_id: int,
    _: User = Depends(require_roles(UserRole.admin, UserRole.ops)),
    db: Session = Depends(get_db),
):
    astro = get_astrologer(db, astro_id)
    if not astro:
        raise HTTPException(status_code=404, detail="Astrologer not found")
    return astrologer_to_admin(astro)


@router.patch("/{astro_id}", response_model=AstrologerAdminOut)
def admin_update_astrologer(
    astro_id: int,
    body: AstrologerUpdate,
    _: User = Depends(require_roles(UserRole.admin, UserRole.ops)),
    db: Session = Depends(get_db),
):
    astro = get_astrologer(db, astro_id)
    if not astro:
        raise HTTPException(status_code=404, detail="Astrologer not found")
    return astrologer_to_admin(update_astrologer(db, astro, body))


@router.delete("/{astro_id}", status_code=204)
def admin_suspend_astrologer(
    astro_id: int,
    _: User = Depends(require_roles(UserRole.admin, UserRole.ops)),
    db: Session = Depends(get_db),
):
    astro = db.get(Astrologer, astro_id)
    if not astro:
        raise HTTPException(status_code=404, detail="Astrologer not found")
    astro.status = AstrologerStatus.suspended
    db.commit()
