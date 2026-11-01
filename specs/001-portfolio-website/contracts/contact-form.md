# Contract: Contact Form (Server Action)

**Location**: `app/contact/actions.ts`, exported `sendContactMessage(prevState, formData)`
(the pure pipeline is `processContact(raw, { ipHash, now })`, unit-tested directly).
The contact page renders per request so `renderedAt` is fresh.
Consumed by `components/contact/ContactForm` through `useActionState`; the
`<form action={sendContactMessage}>` posts natively without JavaScript.

## Request (multipart form fields)

| Field | Required | Validation | Notes |
|-------|----------|-----------|-------|
| name | yes | trimmed, 2-80 chars | |
| email | yes | valid email, <= 254 chars | used as `reply_to` |
| message | yes | trimmed, 10-2000 chars | |
| website | no | must be empty | honeypot, hidden via CSS + `tabindex=-1` + `autocomplete=off`, label "Leave this field empty" |
| renderedAt | yes | integer; `3000 <= now - renderedAt <= 86_400_000` | hidden; set at render |

Server also reads the client IP from request headers (`x-forwarded-for`,
first value) and hashes it with a daily salt for rate limiting only.

## Processing order

1. Parse with Zod -> on failure return `invalid` with per-field messages.
2. Honeypot non-empty or timing out of range -> return `success` (silent
   rejection, nothing sent, counted in logs as `rejected`).
3. Rate limit: sliding window 3 per 10 minutes per `ipHash` -> on exceed
   return `limited` with `retryAfterSeconds`.
4. Send via Resend: `from: "Portfolio <contact@<verified-domain>>"`,
   `to: profile.email`, `reply_to: email`, subject
   `"Portfolio contact from <name>"`, text body with name, email, message,
   timestamp. On error return `failed`.
5. Return `success`.

## Response state (serialisable)

```ts
type ContactState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'invalid'; errors: Partial<Record<'name' | 'email' | 'message', string>>; values: { name: string; email: string; message: string } }
  | { status: 'limited'; retryAfterSeconds: number; mailto: string }
  | { status: 'failed'; mailto: string };
```

`mailto` is `mailto:<profile.email>?subject=Portfolio%20contact`.

## UI contract

- `invalid`: each error rendered next to its field with `aria-describedby`;
  focus moves to the first invalid field; submitted values are preserved.
- `success`: form replaced by a confirmation region with `role="status"`;
  a "Send another" control resets to `idle`.
- `limited` / `failed`: `role="alert"` message containing a link to `mailto`.
- While pending (JS on): submit button disabled with `aria-busy`, label
  "Sending...".
- Without JS: the page re-renders with the same states after the native
  POST; no client code is required for any state.

## Environment

| Variable | Required in production | Behaviour when missing |
|----------|------------------------|------------------------|
| RESEND_API_KEY | yes | log payload, return `success` (dev/preview only; CI asserts presence for production deploys) |
| CONTACT_FROM | yes | default `onboarding@resend.dev` in dev |
| UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN | yes | rate limiter becomes a no-op with a warning log |
| CONTACT_IP_SALT | yes | falls back to a build-time constant in dev |

## Security notes

- All validation is server-side; client validation is a convenience mirror of
  the same Zod schema.
- No message content is logged; logs contain only status and `ipHash` prefix.
- CSRF: Server Actions are origin-checked by Next.js; no extra token needed.
