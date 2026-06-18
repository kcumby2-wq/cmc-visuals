/* ============================================================
   COMMUNITY SUBSCRIPTION CHECKOUT — the onboarding subscribe step.
   After the second meeting, the parent subscribes (80/20 rev split
   relationship begins) and is auto-added to the SubjectSkillz
   community via the HighLevel bridge on payment (handled in webhook).
   ============================================================ */
import Stripe from "stripe";
import { NextResponse } from "next/server";
import SM from "@/config/subjectmedia.config.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { tier = "basic", email } = await request.json();
    const t = SM.coachingMembership.tiers[tier];
    if (!t || !t.stripeMonthlyPriceId || t.stripeMonthlyPriceId.includes("REPLACE")) {
      return NextResponse.json({ error: "Membership tier not configured" }, { status: 503 });
    }
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: t.stripeMonthlyPriceId, quantity: 1 }],
      customer_email: email,
      phone_number_collection: { enabled: true },
      metadata: { tier },
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/onboard?subscribed=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/onboard?canceled=1`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("community checkout error:", err.message);
    return NextResponse.json({ error: "Subscription checkout failed" }, { status: 500 });
  }
}
