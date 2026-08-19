# Prototype boundaries

## Purpose

InsightGuard AI is a static portfolio demonstration. It illustrates a possible product experience for operational analytics and governance; it is not a deployable production service.

## What happens locally

- CSV and Excel files are read and processed in the browser using the pinned SheetJS library.
- The dashboard, AI-style insights, reports, demo profile, support-ticket simulation, and checkout simulation run entirely in the browser.
- A small amount of demo state is stored in local storage so the prototype can retain a profile, uploaded-file history, and demo checkout result during a presentation.
- The provided people, organisations, routes, addresses, contacts, prices, plans, and records are fictional examples.

## What does not happen

- No files, form responses, payment details, or customer data are submitted to an InsightGuard server.
- No authentication, password handling, identity verification, account creation, access control, or tenant isolation exists.
- No payment provider is loaded, no charge is created, and no subscription or invoice is valid outside the browser simulation.
- No live AI model, API, email, CRM, ticketing, analytics, monitoring, or support system is connected.
- No security or compliance certification is claimed by this prototype.

## Safe demonstration rules

1. Use the included sample dataset or fictional, non-sensitive test data only.
2. Do not enter a real card number, bank/UPI identifier, password, personal identifier, customer record, or confidential business data.
3. Treat all dashboard outputs, receipts, policies, pricing, and reports as illustrative.
4. After a demonstration, clear the site's browser data if you entered personal demo information.
5. Before production work, replace the static architecture with an appropriately secured backend and complete legal, privacy, security, and accessibility reviews.

## External resources

The static-site policy allows two external resources only:

- Google Fonts for typography
- SheetJS `xlsx@0.18.5` from jsDelivr for local Excel parsing

Adding another external script, style, image, API, or payment provider requires reviewing and updating the Content Security Policy in `_headers`.
