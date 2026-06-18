# CMC Visuals — Deploy & Test Guide (for Claude Code)

Reusable creator-storefront template. Everything creator-specific lives in
`src/config/creator.config.js`. Clone for a new creator by editing only that
file, or use the parent onboarding flow which writes a new creator to the DB.

## What's built
- Storefront (`/`) — packages from config, Stripe Connect checkout
- Parent onboarding (`/onboard`) — provisions the kid's Stripe Connect account
- Role-scoped dashboard (`/dashboard`) — creator / parent / admin (scope.js)
- API routes: `/api/checkout`, `/api/webhook`, `/api/onboard`, `/api/community`
- Libs: Supabase (service role), role scoping, HighLevel bridge, email
- Multi-tenant Supabase schema applied (project `zrhblsrtyilpopqjengp`)

## Run locally
1. `npm install`
2. Copy `.env.example` → `.env.local`, fill values (Supabase keys, Stripe TEST keys + webhook secret, HL URL, Resend key)
3. `npm run validate`
4. `npm run dev`

## Test the money flow (Stripe TEST mode, before going live)
- [ ] Buy → Connect checkout → test card 4242 → order row appears
- [ ] 80/20 split: application_fee_amount = 20% on the PaymentIntent
- [ ] Subscription → coaching_members row → HL grant fires
- [ ] invoice.payment_failed → past_due, NOT revoked (dunning)
- [ ] customer.subscription.deleted → cancelled → HL revoke
- [ ] Parent onboarding → Connect account created → onboarding URL returned
- [ ] Dashboard scoping: creator own-data only, parent money-view, admin all

## Go live
1. Set env vars in Vercel (never commit secrets)
2. Register Stripe webhook → `/api/webhook` → events: checkout.session.completed, invoice.payment_failed, customer.subscription.deleted, customer.subscription.updated
3. Switch to live Stripe keys, point domain, redeploy

## Vision
Two-call flow: discovery, then onboarding. After call 2 the parent uses `/onboard`,
subscribes (80/20 split begins), kid has tools next day. Feeds SubjectSkillz
1-on-1s + cohorts. Automation target 95%; the calls stay human on purpose.
