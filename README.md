# ResQCard

Your critical health information, when every second matters.

A privacy-first emergency health profile: one QR code opens a public view with only the
information a first responder needs — blood group, allergies, medications, conditions, and an
emergency contact. No data is stored in the QR itself, no login is needed to view it, and every
scan is logged for the owner.

## Features (MVP)

1. Create an emergency profile
2. Generate a personal QR code
3. Scan → public emergency view (no account needed)
4. Private dashboard vs. public emergency data — clean separation
5. Access log — see every time your card was viewed
6. One-tap "call emergency contact" + one-tap deactivate

## Stack

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- **Supabase** — Postgres, Auth, Row Level Security
- `qrcode.react` for QR generation
- `lucide-react` for icons
- Deploy target: **Vercel**

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a project, then in the **SQL Editor** run the
contents of [`supabase/schema.sql`](supabase/schema.sql). This creates all four tables
(`profiles`, `emergency_information`, `access_logs`, `trusted_contacts`) with Row Level Security
policies already applied.

### 3. Configure environment variables

Copy the example file and fill in your Supabase project's URL and anon key (Project Settings →
API):

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_SITE_URL` is used to build the URL encoded in each QR code — set it to your deployed
domain in production (e.g. `https://resqcard.vercel.app`).

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 5. Deploy

Push to GitHub, import the repo in Vercel, and add the same three environment variables in the
Vercel project settings.

## How the QR system works

The QR code never contains medical data — only a link to a random public identifier:

```
QR → https://yourapp.vercel.app/emergency/8f72a91c
        ↓
   look up profile by public_id
        ↓
   show only emergency-safe fields
        ↓
   write a row to access_logs
```

This means the owner can update their information at any time without reprinting the QR, and can
deactivate the card instantly from Settings if it's lost — the public page then shows a
"deactivated" notice instead of any information.

## Privacy model

| Surface | Who can see it | What it shows |
|---|---|---|
| `/emergency/[id]` (public) | Anyone with the link/QR, no login | Name, blood group, allergies, medications, conditions, emergency contact |
| `/dashboard`, `/profile`, `/access-logs`, `/settings` | Authenticated owner only | Everything, plus edit access and the full access log |

Enforced with Postgres Row Level Security (see `supabase/schema.sql`), not just app-layer checks.

## Project structure

```
app/
  page.tsx                → Landing page
  login/, signup/         → Auth
  dashboard/              → Owner dashboard
  profile/                → Edit emergency profile
  qr/                     → View / print QR
  emergency/[id]/         → Public emergency view
  access-logs/            → Full scan history
  settings/               → Deactivate/reactivate card
  api/deactivate/         → Route handler for the deactivate toggle
components/               → Navbar, EmergencyCard, QRCode, ProfileForm, AccessLog, DeactivateToggle
lib/                      → Supabase client (browser + server)
middleware.ts             → Protects private routes, refreshes session
supabase/schema.sql       → Full DB schema + RLS policies
```

## Roadmap (not built in this MVP, schema/architecture ready for it)

- **Family & caregiver access** — `trusted_contacts` table already exists; next step is inviting
  a contact to a "verified responder" tier with more detail than the public view.
- **Multilingual emergency profile** — store a `preferred_language` on `profiles` and translate
  the emergency view labels.
- **NFC + wearables** — same `/emergency/[id]` URL, written to an NFC tag instead of printed as a
  QR.
- **Offline-friendly card** — a printable, cached version of the emergency view for zero-connectivity
  situations.
- **Hospital / provider integration** — authorized write access from a verified healthcare
  provider into `emergency_information`.

## Demo script (2–3 minutes)

1. **Setup** — "Imagine someone is in an emergency and can't communicate." Show the profile form.
2. **Generate QR** — Show the `/qr` page.
3. **Scan** — Open `/emergency/[id]` on a second device/tab.
4. **Information** — Point out blood group, allergies, medications, emergency contact — visible
   instantly, no login.
5. **Security** — Go back to `/dashboard`, show the new row in "Recent access."
6. **Privacy** — Explain: the responder only ever saw the emergency-safe fields; the full profile
   stayed private the whole time.
