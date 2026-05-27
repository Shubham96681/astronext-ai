"""PayU checkout: init payment, handle return callback, order status."""

from __future__ import annotations

import json
import secrets
import urllib.parse

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import OrderStatus, StoreOrder
from app.schemas.payments import OrderStatusResponse, PayuFormField, PayuInitRequest, PayuInitResponse
from app.services.payu import build_request_hash, build_response_hash, verify_response_hash

router = APIRouter(prefix="/payments", tags=["payments"])


def _inr_from_paise(paise: int) -> str:
    return f"{paise / 100:.2f}"


def _paise_from_inr(amount: float) -> int:
    return int(round(amount * 100))


def _make_txnid(order_id: int) -> str:
    suffix = secrets.token_hex(3)[:5]
    return f"AN{order_id}{suffix}"[:25]


def _productinfo(items: list) -> str:
    names = [item.name for item in items[:3]]
    label = ", ".join(names)
    if len(items) > 3:
        label += f" +{len(items) - 3} more"
    return (label or "AstroNext Order")[:100]


def _ensure_payu_config() -> None:
    if not settings.payu_merchant_key or not settings.payu_salt:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="PayU is not configured. Set PAYU_MERCHANT_KEY and PAYU_SALT.",
        )


@router.post("/payu/init", response_model=PayuInitResponse)
def payu_init(body: PayuInitRequest, db: Session = Depends(get_db)):
    server_total_paise = _paise_from_inr(body.subtotal) + _paise_from_inr(body.delivery)
    client_total_paise = _paise_from_inr(body.total)
    if server_total_paise != client_total_paise:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order total mismatch")

    email = (body.email or "").strip() or f"{body.phone.replace(' ', '')}@astronext.local"
    firstname = body.customer_name.strip().split()[0][:60]

    order = StoreOrder(
        txnid="pending",
        customer_name=body.customer_name.strip(),
        phone=body.phone.strip(),
        email=email,
        address=body.address.strip(),
        items_json=json.dumps([item.model_dump() for item in body.items]),
        subtotal_paise=_paise_from_inr(body.subtotal),
        delivery_paise=_paise_from_inr(body.delivery),
        total_paise=client_total_paise,
        payment_method=body.payment_method,
        delivery_slot=body.delivery_slot,
        coupon=body.coupon,
        status=OrderStatus.pending,
    )
    db.add(order)
    db.flush()

    order.txnid = _make_txnid(order.id)
    db.commit()
    db.refresh(order)

    if body.payment_method == "cod":
        order.status = OrderStatus.cod
        db.commit()
        return PayuInitResponse(order_id=order.id, txnid=order.txnid, cod=True)

    _ensure_payu_config()
    amount = _inr_from_paise(order.total_paise)
    productinfo = _productinfo(body.items)
    txnid = order.txnid

    request_hash = build_request_hash(
        key=settings.payu_merchant_key,
        txnid=txnid,
        amount=amount,
        productinfo=productinfo,
        firstname=firstname,
        email=email,
        salt=settings.payu_salt,
        udf1=str(order.id),
    )

    fields = [
        PayuFormField(name="key", value=settings.payu_merchant_key),
        PayuFormField(name="txnid", value=txnid),
        PayuFormField(name="amount", value=amount),
        PayuFormField(name="productinfo", value=productinfo),
        PayuFormField(name="firstname", value=firstname),
        PayuFormField(name="email", value=email),
        PayuFormField(name="phone", value=body.phone.strip()),
        PayuFormField(name="surl", value=settings.payu_success_url),
        PayuFormField(name="furl", value=settings.payu_failure_url),
        PayuFormField(name="hash", value=request_hash),
        PayuFormField(name="service_provider", value="payu_paisa"),
        PayuFormField(name="udf1", value=str(order.id)),
        PayuFormField(name="address1", value=body.address.strip()[:100]),
    ]

    return PayuInitResponse(
        order_id=order.id,
        txnid=txnid,
        payu_action=settings.payu_base_url,
        payu_fields=fields,
    )


@router.get("/payu/config-debug")
def payu_config_debug():
    # Local debugging: ensure the running FastAPI process actually loaded backend/.env
    return {
        "payu_merchant_key_set": bool(settings.payu_merchant_key),
        "payu_salt_set": bool(settings.payu_salt),
        "payu_salt_len": len(settings.payu_salt) if settings.payu_salt else 0,
        "payu_base_url": settings.payu_base_url,
        "frontend_base_url": settings.frontend_base_url,
    }


@router.post("/payu/return")
async def payu_return(request: Request, db: Session = Depends(get_db)):
    form = await request.form()
    data = {k: form.get(k, "") for k in form.keys()}
    data = {k: str(v) if v is not None else "" for k, v in data.items()}

    txnid = data.get("txnid", "")
    payu_status = data.get("status", "")
    received_hash = data.get("hash", "")

    order = db.query(StoreOrder).filter(StoreOrder.txnid == txnid).first()
    if not order:
        return RedirectResponse(
            url=f"{settings.frontend_base_url}/checkout/failure?reason=order_not_found",
            status_code=303,
        )

    if settings.payu_salt:
        expected = build_response_hash(
            salt=settings.payu_salt,
            status=payu_status,
            key=data.get("key", settings.payu_merchant_key),
            txnid=txnid,
            amount=data.get("amount", _inr_from_paise(order.total_paise)),
            productinfo=data.get("productinfo", ""),
            firstname=data.get("firstname", order.customer_name.split()[0]),
            email=data.get("email", order.email),
            udf1=data.get("udf1", ""),
            udf2=data.get("udf2", ""),
            udf3=data.get("udf3", ""),
            udf4=data.get("udf4", ""),
            udf5=data.get("udf5", ""),
        )
        if not verify_response_hash(expected, received_hash):
            order.status = OrderStatus.failed
            order.payu_status = "hash_mismatch"
            db.commit()
            return RedirectResponse(
                url=f"{settings.frontend_base_url}/checkout/failure?txnid={urllib.parse.quote(txnid)}&reason=invalid_hash",
                status_code=303,
            )

    order.payu_mihpayid = data.get("mihpayid") or None
    order.payu_status = payu_status

    if payu_status.lower() == "success":
        order.status = OrderStatus.paid
        db.commit()
        return RedirectResponse(
            url=f"{settings.frontend_base_url}/checkout/success?txnid={urllib.parse.quote(txnid)}",
            status_code=303,
        )

    order.status = OrderStatus.failed
    db.commit()
    return RedirectResponse(
        url=f"{settings.frontend_base_url}/checkout/failure?txnid={urllib.parse.quote(txnid)}",
        status_code=303,
    )


@router.get("/orders/{txnid}", response_model=OrderStatusResponse)
def get_order_status(txnid: str, db: Session = Depends(get_db)):
    order = db.query(StoreOrder).filter(StoreOrder.txnid == txnid).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return OrderStatusResponse(
        txnid=order.txnid,
        status=order.status.value,
        amount_inr=order.total_paise / 100,
        customer_name=order.customer_name,
        mihpayid=order.payu_mihpayid,
    )
