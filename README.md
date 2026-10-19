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
| `NEXT_PUBLIC_USE_MOCK_API` | `true` = in-browser demo adapter. Set `false` once your API is wired |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, Open Graph |
| `NEXT_PUBLIC_APP_STORE_URL` / `NEXT_PUBLIC_PLAY_STORE_URL` | Store badges on the home and check pages |

Never put secrets in `NEXT_PUBLIC_*` variables.

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
src/context/auth-context.jsx   frontend auth state (adapt to your session method)
src/lib/fit/             rules.config.js, evaluate.js (+ tests), appliances.js
src/lib/api/             client.js, endpoints.js, auth/user/fitChecks/contact services
src/lib/api/mock/        demo adapter (localStorage) — kept separate from real services
src/lib/validation/      Zod schemas
src/lib/content/         guides.js, faq.js
```

## Mock mode

With `NEXT_PUBLIC_USE_MOCK_API=true` the UI runs against `src/lib/api/mock`, which stores data in `localStorage`. **This is a UI demo, not security.** The demo OTP code is shown in `src/lib/api/mock/db.js` (`MOCK_OTP`). UI components import only `api` from `src/lib/api/index.js`, so switching to the real backend needs no component changes.

## Connecting your backend

1. Set `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_USE_MOCK_API=false`.
2. Replace every `/TODO/...` path in `src/lib/api/endpoints.js`.
3. In `src/lib/api/client.js`: add auth headers in `getAuthHeaders()` if you use tokens (cookies work out of the box via `credentials: "include"`), and map your error shape in the `!res.ok` branch.
4. In `auth.js`, `user.js`, `fitChecks.js`, `contact.js` adjust request payloads and map responses to the shapes the UI expects (documented in each file).
5. In `src/context/auth-context.jsx` adapt session restore/expiry to your auth method. Your backend must enforce all real authentication and authorization.

### Endpoints to connect (paths and payloads are placeholders — none were provided)

| Key | Method | Used by |
| --- | --- | --- |
| `register` | POST | Registration form |
| `login` | POST | Login form |
| `logout` | POST | Logout dialog |
| `verifyOtp` | POST | Email OTP verification |
| `resendOtp` | POST | Resend OTP (30 s cooldown UI) |
| `forgotPassword` | POST | Forgot-password form |
| `verifyResetOtp` | POST | Reset verification |
| `resetPassword` | POST | Reset-password form |
| `session` | GET | Session restore / expiry |
| `getProfile` / `updateProfile` | GET / PATCH | Profile page |
| `changePassword` | POST | Settings |
| `listFitChecks` / `saveFitCheck` / `deleteFitCheck` | GET / POST / DELETE | Dashboard history |
| `evaluateFit` (optional) | POST | Server-side fit evaluation |
| `sendContact` | POST | Contact form |

## Important: fit rules are placeholders

The original site's calculator is dynamic and its logic was not in the extracted content (the document states calculator results cannot be extracted). Only the four outcomes — **Fits Perfectly, Tight Fit, Requires Modification, Does Not Fit** — and the inputs (product H/W/D, space H/W/D, in inches) are known.

The thresholds in `src/lib/fit/rules.config.js` (e.g. tight below 0.25 in, modification up to 0.5 in short) are **invented placeholders so the UI works**; the UI labels them as such (`RULES_ARE_PLACEHOLDERS`). Please provide your real rules or replace `evaluateFit` / call the `evaluateFit` endpoint. Unit tests in `src/lib/fit/evaluate.test.js` must be updated to match.

## Other items needing your input

- Privacy Policy and Terms are drafts (`LEGAL_IS_DRAFT` in `src/lib/config.js`) — replace with reviewed legal text.
- Guides marked PARTIAL in the extraction document contain only the captured summary; expand them with the full original articles.
- Store URLs, contact details, and any logo/brand assets.

## Testing status

- Automated: lint clean, 16 unit tests (fit logic), production build succeeds (50 static pages).
- Browser-checked with Playwright in mock mode at 390 / 768 / 1440 px: no horizontal overflow on 13 routes, calculator flow, validation, register → OTP → dashboard, save/view/delete checks, profile edit, password change, logout, forgot → reset → login, mobile drawer, reduced motion; no console errors other than the expected 404 on the not-found page.
- Not tested: real backend authentication, OTP delivery, or any live API (requires your backend).

## Deployment

Any Node host or Vercel: set the environment variables, run `npm run build`, then `npm start` (or deploy via the platform's Next.js builder).
