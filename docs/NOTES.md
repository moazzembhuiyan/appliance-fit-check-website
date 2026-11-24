# Appliance Fit Check — Frontend

Frontend-only redesign of appliancefitcheck.org built with Next.js (App Router), JavaScript, Tailwind CSS (v3.4) v3.4, Radix primitives, Motion, React Hook Form + Zod, Sonner and Lucide.
There is **no backend, database, API route or server action** in this project. Your existing backend is connected through `src/lib/api/`.

## Quick start

```bash
npm install
cp .env.example .env.local   # then edit
npm run dev                  # http://localhost:3000
npm run lint
npm test                     # vitest (fit logic)
npm run build && npm start   # production
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Base URL of your existing backend (no trailing slash) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, Open Graph |
| `NEXT_PUBLIC_APP_STORE_URL` / `NEXT_PUBLIC_PLAY_STORE_URL` | Store badges on the home and check pages |
| `NEXT_ALLOWED_DEV_ORIGINS` | Optional comma-separated hostnames for opening `next dev` from a LAN IP (no scheme or port) |

Never put secrets in `NEXT_PUBLIC_*` variables.
If the frontend PC's LAN IP changes, update `NEXT_ALLOWED_DEV_ORIGINS` in `.env.local` and restart the dev server.

## Site map

Public: `/`, `/check` (calculator), `/guides`, `/guides/[slug]` (26 guides from the extracted content), `/about`, `/faq`, `/contact`, `/privacy`, `/terms`.
Auth: `/login`, `/register`, `/verify-otp`, `/forgot-password`, `/reset-password`, `/session-expired`, `/unauthorized`.
Account (guarded, `noindex`): `/dashboard`, `/dashboard/checks`, `/profile`, `/settings`.

## Project structure

```
src/app/                 routes, layouts, metadata, sitemap, robots
src/components/ui/       button, dialog, field, section, reveal, badges
src/components/layout/   header, footer, logo, contact form, logout dialog
src/components/calculator/  fit-checker, diagram, result panel
src/components/auth/     auth shell, forms, OTP input, auth guard
src/components/dashboard/ account nav, saved-checks list
src/components/providers.jsx   Redux and auth providers
src/context/auth-context.jsx   Redux-backed auth state
src/store/                Redux Toolkit store, auth slice, RTK Query endpoints
src/lib/fit/             rules.config.js, evaluate.js (+ tests), appliances.js
src/lib/api/             client.js, endpoints.js, auth/user/fitChecks/contact services
src/lib/validation/      Zod schemas
src/lib/content/         guides.js, faq.js
```

## API integration

The app calls the configured backend directly; mock adapters have been removed. Redux Toolkit Query mutations and queries are in `src/store/api.js`, and request/response adapters are in `src/lib/api/`.

### Integrated auth and user endpoints

| Endpoint | Method | Request |
| --- | --- | --- |
| `/auth/login` | POST | `{ email, password }` |
| `/users/register` | POST | multipart `data` JSON (`name`, `email`, `password`, `contactNumber`) and optional `image` |
| `/otp/verify-otp` | POST | `{ otp }` with the OTP token in `Authorization` |
| `/otp/resend-otp` | POST | `{ email }` |
| `/auth/forget-password` | POST | `{ email }` |
| `/auth/reset-password` | POST | `{ email, newPassword, confirmPassword }` with the OTP token in `Authorization` |
| `/auth/change-password` | POST | `{ oldPassword, newPassword }` |
| `/auth/refresh-token` | POST | Authorization header |
| `/users/my-profile` | GET | Authorization header |
| `/users/update-my-profile` | PUT | multipart `data` JSON and optional `image` |
| `/users/delete-profile` | DELETE | Authorization header |
| `/appliance-models/types` | GET | Lists available appliance types and model counts |
| `/appliance-models/by-type-and-model` | GET | `type` and `model` query parameters |
| `/contents` | GET | Public legal content; the app displays `termsAndConditions` and `privacyPolicy` |
| `/appliance-fit` | POST | `{ author, type, measurements, cutoutMeasurements }` (`author` is the signed-in user's `_id`) |
| `/appliance-fit/my-appliance-fit` | GET | Authorization header; accepts `page` and `limit` query parameters |
| `/appliance-fit/:id` | GET | Fetches an individual fit check and its current `isPaid` status |
| `/appliance-fit/:id` | DELETE | Authorization header |
| `/payments/checkout` | POST | `{ user, reference }`; returns a Stripe checkout URL |

Logout is local token cleanup because the Postman collection does not define a logout route. The collection also does not define a contact-message endpoint; configure `sendContact` in `src/lib/api/endpoints.js` when that backend route is available.

The fit calculator loads every appliance type and its model dimensions from the backend, accepts exact inch fractions (for example `29 7/8`) or decimals, and displays measurements as simplified fractions. Fractions are converted to their numeric inch equivalents for the API, which expects numeric measurements. Fit checks submit to `/appliance-fit`, and the returned result is displayed only when `isPaid` is true. Unpaid results remain visually locked; checkout is started through `/payments/checkout`. `/appliance-fit/my-appliance-fit` is loaded with pagination for the dashboard; on the calculator, pressing “I’ve paid — check status” fetches only that result through `/appliance-fit/:id`.

**Backend security requirement:** a browser cannot hide a response body from its own DevTools Network panel. To keep an unpaid fit result private, the backend must omit protected result fields (including status, per-dimension status, and fail reason) from unpaid create/list/detail responses, and enforce payment authorization on `/appliance-fit/:id`. Frontend blur/lock states are presentation only and do not provide this protection.

## Fit result handling

The calculator uses backend fit results; the local fit thresholds are not used to determine results. Product dimensions can be filled from the appliance model lookup or entered manually.

## Other items needing your input

- Privacy Policy and Terms are drafts (`LEGAL_IS_DRAFT` in `src/lib/config.js`) — replace with reviewed legal text.
- Guides marked PARTIAL in the extraction document contain only the captured summary; expand them with the full original articles.
- Store URLs, contact details, and any logo/brand assets.

## Testing status

- Automated: lint clean, API and fit-logic unit tests, production build succeeds (50 static pages).
- Browser smoke-tested in mock mode before mock removal at 390 / 768 / 1440 px: auth, profile, password, and fit-check flows.
- Not tested: live backend authentication, OTP delivery, model catalog, payment checkout, or Stripe return flow.

## Deployment

Any Node host or Vercel: set the environment variables, run `npm run build`, then `npm start` (or deploy via the platform's Next.js builder).
