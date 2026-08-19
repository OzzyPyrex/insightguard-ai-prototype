# InsightGuard AI — Portfolio Prototype

InsightGuard AI is a browser-only portfolio prototype for exploring operational analytics, data-quality checks, AI-style explanations, reporting, and governance workflows for transport and fleet teams.

It is a presentation artifact, not a live SaaS product. Its organisations, people, records, prices, payments, receipts, and support interactions are fictional demonstration content.

## Prototype boundaries

- No real account, sign-in, identity verification, role permission, subscription, payment, invoice, support service, or email service exists.
- No payment provider or payment-processing code is connected. The checkout is a local simulation; do not enter a real card number or financial information.
- CSV and Excel files are parsed locally in the browser. Uploads are not sent to a server, but should still contain only synthetic or non-sensitive data.
- Demo profile, workspace, upload-history, and checkout-simulation details may be stored in this browser's local storage. Clear this site's browser data to remove them.
- The dashboard's AI-style insights are deterministic frontend demonstrations, not output from a live AI model or API.

Read [PROTOTYPE_BOUNDARIES.md](PROTOTYPE_BOUNDARIES.md) before demonstrating, deploying, or extending the project.

## Run locally

Open `index.html` for a quick preview, or serve the folder locally for the most reliable experience:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy as a portfolio demo

The project is static and Netlify-ready. Deploy the complete `insightguard-mvp` folder with no build command.

`_headers` applies a restrictive Content Security Policy. It deliberately permits only the site itself, Google Fonts, and the pinned SheetJS CDN required for local Excel parsing. Review the policy before adding any new external resource.

## What the demo shows

- Responsive marketing site and interactive workspace
- Local CSV and Excel parsing, plus a fictional sample dataset
- Dashboard calculations, data-quality indicators, reports, and CSV exports
- AI-style operational recommendations and governance checklist flows
- Local demo-profile, customer, and support-ticket interactions
- Prototype checkout simulation using the supplied test values only
- Downloadable, clearly labelled prototype receipt

## Test inputs for the checkout simulation

- Test card: `4242 4242 4242 4242`
- Test expiry: `12/30`
- Test CVC: `123`
- Test UPI: `demo@upi`

These inputs are only used to demonstrate browser-side validation. No money is charged, no payment is submitted, and card values are cleared after the simulation completes.

## Main files

- `index.html` — marketing site, workspace shell, and simulation markup
- `styles.css` and `premium.css` — responsive visual system
- `app.js` — dashboard state, calculations, reports, and local exports
- `enhancements.js` — local profile, upload, and prototype-checkout interactions
- `payment-config.js` — immutable prototype-mode declaration; it cannot enable real payments
- `_headers` — Netlify security headers
- `sample_fleet_data.csv` — fictional sample data

## Production work deliberately out of scope

A real product would require a backend, secure authentication and authorisation, tenant isolation, server-side file validation and malware scanning, database and storage controls, a monitored AI service, hosted payment checkout with server-side webhook verification, privacy/legal work, observability, backups, and formal security review.

Never add private API keys, credentials, real customer data, or payment secrets to this repository.
