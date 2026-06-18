/* ============================================================
   STRIPE CONNECT CHECKOUT
   Money flows through the CENTRAL account (Subject Media /
   XPAND Media LLC). The creator's split (default 80%) is paid
   to their connected account automatically; the rest stays central.
   The order is NOT recorded here — the webhook does that.
   ============================================================ */
import Stripe from "stripe";
import { NextResponse } from "next/server";
import CREATOR from "@/config/creator.config.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const { packageId } = await request.json();

    const pkg =
      (CREATOR.packages || []).find((p) => p.id === packageId) ||
      (CREATOR.teamTier && packageId === "team" ? { ...CREATOR.teamTier, id: "team" } : null);
    if (!pkg) return NextResponse.json({ error: "Unknown package" }, { status: 400 });

    const co = CREATOR.checkout;
    if (!co.connectedAccountId || co.connectedAccountId.includes("REPLACE")) {
      return NextResponse.json({ error: "Creator Stripe Connect account not configured" }, { status: 503 });
    }

    const amount = Math.round(pkg.price * 100);
    const creatorSplit = Math.round(amount * (co.creatorSplitPercent / 100));
    const platformFee = amount - creatorSplit; // Subject Media's cut

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: { name: `${CREATOR.businessName} — ${pkg.name}`, description: pkg.desc },
        },
      }],
      payment_method_types: co.paymentMethods || ["card"],
      phone_number_collection: { enabled: !!co.collectPhone },
      custom_fields: (co.customFields || []).map((f, i) => ({
        key: `field_${i}`,
        label: { type: "custom", custom: f.label },
        type: "text",
        optional: !f.required,
      })),
      payment_intent_data: {
        application_fee_amount: platformFee,
        transfer_data: { destination: co.connectedAccountId },
      },
      consent_collection: co.parentalConsent ? { terms_of_service: "required" } : undefined,
      metadata: { creator_id: CREATOR.slug || "cmc-visuals", package_id: pkg.id, product: pkg.name },
      success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/?paid=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("checkout error:", err.message);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
