# Contact form email setup (Resend + Vercel)

The contact form posts to `/api/contact`, which validates the input, rate-limits by IP, and sends an email with Resend to `CONTACT_TO_EMAIL`. The visitor's address is set as Reply-To. Until the variables below are set, the form shows an error (it never pretends to succeed).

## 1. Resend: verify a sending domain (required to email vdn23022003@gmail.com from your own address)
1. Sign up at resend.com. Domains > Add Domain, then enter a domain you own (for example `your-domain.com`).
2. Resend shows DNS records (SPF and DKIM; DMARC recommended). Add them at your DNS/domain registrar.
3. Click Verify in Resend and wait until the status is Verified (can take minutes to hours).
4. API Keys > Create API Key (permission: Sending access, restricted to your domain). Copy it once.
5. Choose the From address on that domain, e.g. `contact@your-domain.com`. Replace `your-domain.com` with your real domain.
Testing shortcut: before your domain is verified, Resend's `onboarding@resend.dev` sender can only deliver to the email address of your own Resend account.

## 2. Upstash Redis (rate limiting, required in production)
Create a free Redis database at upstash.com (or Vercel Dashboard > Storage/Marketplace > Upstash Redis). Copy the REST URL and REST token.
In production the route refuses to run without it, because an in-memory limiter does not work across serverless instances. Limits: 3 per minute and 8 per hour per IP.

## 3. Vercel environment variables
Vercel > your project > Settings > Environment Variables. Add each variable, ticking the environments you want (Production, Preview, Development):

| Name | Value | Environments |
|---|---|---|
| RESEND_API_KEY | your Resend key | Production, Preview (and Development if you test locally) |
| CONTACT_TO_EMAIL | vdn23022003@gmail.com | all |
| CONTACT_FROM_EMAIL | contact@your-domain.com | all |
| UPSTASH_REDIS_REST_URL | from Upstash | Production, Preview |
| UPSTASH_REDIS_REST_TOKEN | from Upstash | Production, Preview |

Use a separate Resend key for Preview if you do not want test submissions to use the production key. Never prefix these with `NEXT_PUBLIC_` and never commit `.env.local`. Redeploy after changing variables (Deployments > ... > Redeploy). For local development run `vercel env pull .env.local` or copy `.env.example` to `.env.local`.

## 4. Real delivery test (do this after deploying)
1. Open the live site, submit the Contact form with your own email as the visitor.
2. Confirm the email arrives at vdn23022003@gmail.com (check Spam the first time) with subject "New Contact Enquiry – KAIZO LABS".
3. Press Reply: the To field should be the visitor's address.
4. Submit 4 times within a minute: the 4th should show the "too many messages" message.
5. Resend dashboard > Emails shows delivery status and errors.

## 5. Google Form (course enrolment) is separate
The form at https://forms.gle/FDBdNuYpocwoQJsD9 is linked from the "Enrol via Google Form" button and is not connected to Resend. To get emails for new responses, open the form in Google Forms > Responses tab > three-dot menu > "Get email notifications for new responses" (while signed in as the form owner). Check that this is switched on; the code cannot do it for you.

## 6. Free introductory class registration
The homepage registration dialog posts to the existing same-origin `/api/contact` endpoint. It uses the Resend delivery configuration above and the production Upstash rate limiter; no browser-side API key is used. The API validates the required consent, course interest, preferred timing and a 10–15 digit phone number, and the form includes a honeypot. Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in Vercel for production delivery. If these values are missing, registrations show an error and are not reported as successfully sent. Verify delivery with a real submission after deployment.

## Automated checks
`npx tsx scripts/test-contact.ts` runs 15 checks (validation, injection, honeypot, rate limit, error handling, template). It does not send real email.
