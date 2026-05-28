const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

export type ConsultationInitPayload = {
  astrologer_id: string;
  astrologer_name: string;
  astrologer_slug: string;
  price_per_minute: number;
  duration_minutes: number;
  user_id: string;
  phone: string;
  email?: string;
  customer_name?: string;
};

export type PayuFormField = { name: string; value: string };

export type ConsultationInitResponse = {
  txnid: string;
  payu_action: string;
  payu_fields: PayuFormField[];
};

export type ConsultationStatusResponse = {
  txnid: string;
  status: string;
  amount_inr: number;
  astrologer_name: string;
  customer_name: string;
  duration_minutes: number;
  mihpayid: string | null;
};

export async function checkUserByPhone(phone: string): Promise<{ found: boolean; user_id: string; name: string } | null> {
  const res = await fetch(`${API_BASE}/api/v1/auth/user-by-phone?phone=${encodeURIComponent(phone)}`);
  if (res.status === 404) return { found: false, user_id: '', name: '' };
  if (!res.ok) return null;
  const data = await res.json();
  return { found: true, user_id: data.user_id, name: data.name ?? '' };
}

export async function createGuestUser(phone: string): Promise<{ user_id: string }> {
  const res = await fetch(`${API_BASE}/api/v1/auth/guest-user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) throw new Error('Could not create guest user');
  return res.json();
}

export async function initConsultationPayment(payload: ConsultationInitPayload): Promise<ConsultationInitResponse> {
  const res = await fetch(`${API_BASE}/api/v1/payments/consultation/init`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { detail?: string }).detail ?? 'Payment initiation failed');
  }
  return res.json();
}

export async function fetchConsultationStatus(txnid: string): Promise<ConsultationStatusResponse> {
  const res = await fetch(`${API_BASE}/api/v1/payments/consultation/status/${encodeURIComponent(txnid)}`);
  if (!res.ok) throw new Error('Booking not found');
  return res.json();
}

export function redirectToPayu(action: string, fields: PayuFormField[]) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = action;
  form.style.display = 'none';
  for (const f of fields) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = f.name;
    input.value = f.value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}
