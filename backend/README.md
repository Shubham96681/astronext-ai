# AstroNext Python API

FastAPI + **SQLite** backend. **Products are on Shopify** — no product tables here. Full **astrologer** domain is in this API.

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Database file: `backend/astronext.db` (auto-created and seeded on startup).

## SQLite tables (astrologer domain)

| Table | Purpose |
|-------|---------|
| `users` | Auth accounts (admin, astrologer, customer) |
| `astrologers` | Full profiles (bio, pricing, images, status) |
| `astrologer_specialities` | Expertise areas per astrologer |
| `availability_slots` | Weekly consultation windows |
| `consultations` | Booked sessions (chat/call/video) |
| `astrologer_reviews` | Ratings & comments |
| `puja_bookings` | Puja workflow (non-Shopify) |
| `app_meta` | Schema version for migrations |

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@astronext.ai | admin123 |
| Astrologer | astrologer@astronext.ai | astro123 |
| Customer | customer@astronext.ai | customer123 |

## Public API

- `GET /api/v1/astrologers` — list all active astrologers (full profile)
- `GET /api/v1/astrologers/{slug_or_legacy_id}` — detail

## Admin API (`admin` / `ops` role)

- `GET /api/v1/admin/dashboard`
- `GET|POST /api/v1/admin/astrologers`
- `GET|PATCH|DELETE /api/v1/admin/astrologers/{id}`

## Astrologer portal (`astrologer` role)

- `GET /api/v1/astrologer/dashboard`
- `GET|PATCH /api/v1/astrologer/profile` (via dashboard profile)
- `PATCH /api/v1/astrologer/online`
- `GET|POST /api/v1/astrologer/availability`
- `GET|POST /api/v1/astrologer/consultations`

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
