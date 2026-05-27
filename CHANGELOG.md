# Changelog

## Unreleased (2026-05-27)

### Added
- PayU hosted checkout integration (backend + frontend):
  - Backend endpoints: `POST /api/v1/payments/payu/init`, `POST /api/v1/payments/payu/return`, `GET /api/v1/payments/orders/{txnid}`
  - New backend PayU helpers for request/return hash generation/verification
  - New frontend checkout handling that initializes PayU and auto-submits the hosted payment form
  - New frontend pages:
    - `/checkout/success` (shows transaction/order status)
    - `/checkout/failure` (shows failure reason and provides retry links)
- Shopify-based cart repricing/validation before initiating PayU:
  - New route: `POST /api/shopify/validate-cart`
- Backend order persistence for store checkouts:
  - New `store_orders` model/table + status tracking (`pending`, `paid`, `failed`, `cod`)

### Changed
- Divine Store and home catalog now attempt to load products from your live Shopify collection (with fallback to the existing local JSON catalog when Shopify/Admin API access is not available).
- Checkout flow now validates cart line items with Shopify before creating the PayU transaction.
- Checkout UX improvements:
  - If Pay is clicked while required address fields are empty, checkout now shows an error and opens the address editor.
- Environment examples updated:
  - Added PayU configuration placeholders to `backend/.env.example`
  - Updated Shopify credential examples to match expected usage.

### Removed
- Repository cleanup for professional review:
  - Removed root design dumps (`Astro-Home.pdf`, `design-master.png`, `design-reference.png`)
  - Removed 135+ unused/scratch assets from `src/assets` (test images, PDF extractions, duplicate logos, unused generated folders)
  - Kept only assets referenced by the application

### Fixed
- Runtime error on product detail pages:
  - Fixed missing `fetchProductById` import used by `getDivineStoreProductById`.
- Reduced Next.js runtime warning:
  - Added `data-scroll-behavior="smooth"` to the root layout.
- Aligned the PayU failure CTA links (“Try again” / “Back to cart”) consistently.

