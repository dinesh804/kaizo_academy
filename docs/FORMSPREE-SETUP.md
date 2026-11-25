# Contact form with Formspree

The contact form sends its fields directly from the visitor's browser to Formspree's AJAX endpoint. The frontend only needs the public form ID; no Formspree API key belongs in this site.

## Connect a Formspree form

1. Sign in at [Formspree](https://formspree.io/) and create a new form for the contact enquiries.
2. Set the form's notification recipient to the inbox where you want enquiries delivered, then verify that email address if Formspree asks.
3. Copy the form ID from its endpoint. It is the part after `/f/` in a URL like `https://formspree.io/f/xyzaabcd`.
4. In Vercel, open the `kaizo-academy` project → **Settings** → **Environment Variables**. Add `NEXT_PUBLIC_FORMSPREE_ID` with the form ID for **Production** (and Preview if desired).
5. Redeploy the latest production deployment so the public ID is included in the frontend build.
6. Submit a test enquiry and confirm it appears in the Formspree dashboard and recipient inbox.

The form sends the name, email, phone, programme, subject, status and message fields. It sets the email subject and reply-to address, and includes a hidden spam honeypot. The page keeps the existing local validation, duplicate-send guard and email fallback.

Formspree's documented JSON submission endpoint is `https://formspree.io/f/{form_id}` with `Accept: application/json`. See [Formspree's AJAX submission guide](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax).
