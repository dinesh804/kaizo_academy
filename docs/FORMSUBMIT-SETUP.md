# Contact form email via FormSubmit

The Contact Us form posts straight from the visitor's browser to FormSubmit (https://formsubmit.co), which emails vdn23022003@gmail.com. No API key, no server code, no environment variables required.

## One-time activation (required before delivery starts)
1. Deploy (or run `npm run dev`) and open the Contact form.
2. Fill in all fields with test data and press Send enquiry.
3. This first submission will show the "could not send" message on the site. That is expected: FormSubmit has not delivered it yet. It instead emails an activation link to vdn23022003@gmail.com (check Spam/Promotions too).
4. Open that email and click the activation button. FormSubmit then shows you a random alias address for this form.
5. Submit a second test enquiry. It should arrive in vdn23022003@gmail.com with subject "New Contact Enquiry – KAIZO LABS" and a table of every field.
6. Optional but recommended: put the alias in `NEXT_PUBLIC_FORMSUBMIT_ID` (Vercel > Settings > Environment Variables, all environments) and redeploy. The form then submits to `formsubmit.co/ajax/<alias>` and your Gmail address no longer appears in network requests.
Activation is tied to the form's first submission, so use the real production site (or the same address) for the first test.

## Check the details
- Reply-to: open the test email and press Reply; the To field should be the visitor's address (set through FormSubmit's `_replyto`).
- Subject is set through `_subject`; layout through `_template=table`.
- Success is shown only when FormSubmit confirms. If activation is pending, it shows an error rather than a fake success.

## Spam protection and limits (be aware)
- Hidden honeypot field (`_honey`), a 2-second minimum fill time, a 30-second cooldown between sends (per browser tab session), a maximum of 3 links per message, length limits, and no sending while a request is in progress.
- There is no server-side rate limiting in this setup (FormSubmit runs the delivery), so a determined bot could still submit. FormSubmit applies its own filtering. FormSubmit's CAPTCHA is turned off (`_captcha=false`) because it cannot be shown in an AJAX submission; if spam becomes a problem, ask for a server-side check (e.g. Cloudflare Turnstile).
- No analytics, cookies or tracking are added; requests are sent without cookies or referrer.

## Google Form
The "Enrol via Google Form" button (https://forms.gle/FDBdNuYpocwoQJsD9) is untouched and separate. To get emails for its responses, enable "Get email notifications for new responses" in the form's Responses tab.

## Troubleshooting: what the error message means
When sending fails, the form shows a specific message with a reference code. Open the browser's Developer Tools (F12) > Console for the "[contact]" line, and Network > the `formsubmit.co` request to see the exact response.

| Reference | Meaning | What to do |
|---|---|---|
| FS-ACTIVATION | FormSubmit has not been activated for this address/site yet | Open the activation email in vdn23022003@gmail.com (check Spam/Promotions), click the link, then submit again |
| FS-NETWORK | The browser could not reach formsubmit.co (offline, blocked by an ad blocker/firewall, or a CORS block) | Try another network/browser, disable blockers for the site |
| FS-TIMEOUT | No reply within 15 seconds | Try again |
| FS-HTTP-429 | Too many requests recently | Wait a few minutes |
| FS-HTTP-5xx | FormSubmit is having problems | Try again later; use WhatsApp/email meanwhile |
| FS-HTTP-4xx | FormSubmit rejected the request; its reason is shown in the message | Read the reason; send me the Network response |
| FS-NONJSON | FormSubmit returned a web page instead of the expected JSON reply | Send me the Network response |

Every error also shows a "Send by email instead" link that opens the visitor's email app with the message filled in.
