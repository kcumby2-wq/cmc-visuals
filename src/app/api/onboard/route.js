/* ============================================================
   PARENT ONBOARDING — the "second meeting" automation.
   Parent fills the form → this creates the kid's Stripe Connect
   (Express) account, registers the creator in the DB, and returns
   the Stripe onboarding link the parent completes to control the
   account + payouts. This is what makes every new creator self-serve.
   ============================================================ */
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { creatorBusinessName, creatorHandle, location, creatorEmail, parentEmail, parentName, splitPercent } = body;

    if (!creatorBusinessName || !parentEmail || !creatorEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slug = creatorBusinessName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const account = await stripe.accounts.create({
      type: "express",
      email: parentEmail,
      business_type: "individual",
      business_profile: { name: creatorBusinessName, product_description: "Sports media coverage" },
      metadata: { creator_slug: slug, parent_email: parentEmail, network: "subject-media" },
    });

    const db = getServiceClient();
    await db.from("creators").upsert({
      id: slug,
      business_name: creatorBusinessName,
      handle: creatorHandle || "",
      location: location || "",
      status: "onboarding",
      creator_email: creatorEmail,
      parent_email: parentEmail,
      stripe_connect_id: account.id,
      split_percent: splitPercent || 80,
    });

    const link = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/onboard?retry=1`,
      return_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/onboard?done=1`,
      type: "account_onboarding",
    });

    return NextResponse.json({ slug, connectAccountId: account.id, onboardingUrl: link.url });
  } catch (err) {
    console.error("onboard error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
