const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export type CheckoutLineItem = {
  product_id: number;
  name: string;
  price: number;
  qty: number;
};

export type PayuInitPayload = {
  customer_name: string;
  phone: string;
  address: string;
  email?: string;
  payment_method: 'payonline' | 'cod';
  items: CheckoutLineItem[];
  subtotal: number;
  delivery: number;
  total: number;
  delivery_slot?: string;
  coupon?: string;
};

export type PayuFormField = { name: string; value: string };

export type PayuInitResponse = {
  order_id: number;
  txnid: string;
  cod: boolean;
  payu_action?: string;
  payu_fields?: PayuFormField[];
};

export type OrderStatusResponse = {
  txnid: string;
  status: string;
  amount_inr: number;
  customer_name: string;
  mihpayid?: string | null;
};

export async function validateCartWithShopify(
  items: CheckoutLineItem[],
): Promise<CheckoutLineItem[]> {
  const res = await fetch('/api/shopify/validate-cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: items.map((i) => ({
        product_id: i.product_id,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
    }),
  });
  if (!res.ok) {
    let detail = 'Could not validate cart with Shopify';
    try {
      const body = await res.json();
      if (typeof body.error === 'string') detail = body.error;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  const data = (await res.json()) as { items: CheckoutLineItem[] };
  return data.items;
}

export async function initPayuCheckout(payload: PayuInitPayload): Promise<PayuInitResponse> {
  const res = await fetch(`${API_BASE}/api/v1/payments/payu/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    let detail = 'Payment initiation failed';
    try {
      const body = await res.json();
      detail = typeof body.detail === 'string' ? body.detail : detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json() as Promise<PayuInitResponse>;
}

export async function fetchOrderStatus(txnid: string): Promise<OrderStatusResponse> {
  const res = await fetch(`${API_BASE}/api/v1/payments/orders/${encodeURIComponent(txnid)}`);
  if (!res.ok) {
    throw new Error('Order not found');
  }
  return res.json() as Promise<OrderStatusResponse>;
}

/** Auto-submit hidden form to PayU hosted checkout. */
export function redirectToPayu(action: string, fields: PayuFormField[]) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;
  form.style.display = 'none';

  for (const field of fields) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = field.name;
    input.value = field.value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
}
