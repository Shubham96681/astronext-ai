from pydantic import BaseModel, Field


class CheckoutLineItem(BaseModel):
    product_id: int
    name: str = Field(min_length=1, max_length=255)
    price: float = Field(ge=0, description="Unit price in INR")
    qty: int = Field(ge=1, le=99)


class PayuInitRequest(BaseModel):
    customer_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=8, max_length=20)
    address: str = Field(min_length=5, max_length=500)
    email: str | None = Field(default=None, max_length=255)
    payment_method: str = Field(pattern="^(payonline|cod)$")
    items: list[CheckoutLineItem] = Field(min_length=1)
    subtotal: float = Field(ge=0)
    delivery: float = Field(ge=0)
    total: float = Field(gt=0)
    delivery_slot: str | None = None
    coupon: str | None = None


class PayuFormField(BaseModel):
    name: str
    value: str


class PayuInitResponse(BaseModel):
    order_id: int
    txnid: str
    cod: bool = False
    payu_action: str | None = None
    payu_fields: list[PayuFormField] | None = None


class OrderStatusResponse(BaseModel):
    txnid: str
    status: str
    amount_inr: float
    customer_name: str
    mihpayid: str | None = None
