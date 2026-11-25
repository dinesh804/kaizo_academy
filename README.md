# KAIZO LABS website
Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, Lucide.

## Run locally
    npm install
    cp .env.example .env.local
    npm run dev   # http://localhost:3000

## Deploy to Vercel
Push to GitHub, import the repo in Vercel, add the env vars from `.env.example`, deploy.

## Editing content
All copy, programme details and placeholders live in `lib/content.ts`. Items marked [To be confirmed] or "Planned" are placeholders: nothing is invented.

## Enquiry form
`/api/enquiry` validates input server-side but does NOT store it yet. Add firebase-admin (Firestore) at the marked integration point. The UI says so honestly until then.

## Still to do
Separate pages per division, hero 3D asset (SVG globe is a placeholder), real social URLs, privacy/terms pages, Firebase auth.

## Courses
Course data lives in `lib/content.ts` (`courses`, `FEE`, `SCHOLARSHIP_ENABLED`, `BATCH_DATES`). Pages: `/academy` and `/academy/[slug]`. Internal delivery notes: `docs/COURSE-DELIVERY.md`.

## Enquiries to Google Sheets + email alerts
1. Create a Google Sheet. Extensions > Apps Script. Paste `docs/google-apps-script.gs`, set `SECRET`.
2. Deploy > New deployment > Web app (Execute as: Me, Access: Anyone). Authorise it, copy the URL.
3. In `.env.local` (and Vercel) set `GOOGLE_SCRIPT_URL` and `GOOGLE_SCRIPT_SECRET` (same text as SECRET). Restart.
Each enquiry becomes a row in the "Enquiries" sheet and is emailed to you. Optional: `NEXT_PUBLIC_GOOGLE_FORM_URL` shows an "Enrol via Google Form" button.


## Contact form email
The contact form posts to FormSubmit (no API key) and emails vdn23022003@gmail.com. Activation and testing steps: `docs/FORMSUBMIT-SETUP.md`. Run the logic tests with `npx tsx scripts/test-formsubmit.ts`.
