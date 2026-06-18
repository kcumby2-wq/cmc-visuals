/* ============================================================
   STRIPE WEBHOOK — the source of truth for recorded sales.
   - Signature-verified (rejects forged events)
   - Idempotent (logs every event id; ignores duplicates)
   - Records orders, subscriptions, and coaching members
   - Handles dunning: only revoke community access on FINAL failure
   ============================================================ */
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase.js";
import { grantCommunityAccess, revokeCommunityAccess } from "@/lib/highlevel.js";
import { sendConfirmationEmail } from "@/lib/email.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const dynamic = "force-dynamic";

export async function POST(request) {
  const raw = await request.text();
  const sig = request.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("webhook signature failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getServiceClient();

  const { data: seen } = await db.from("webhook_events").select("id,processed").eq("id", event.id).maybeSingle();
  if (seen && seen.processed) return NextResponse.json({ received: true, duplicate: true });
  await db.from("webhook_events").upsert({ id: event.id, type: event.type, processed: false, payload: event });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object;
        if (s.mode === "payment") {
          await db.from("orders").insert({
            id: `ord_${s.id.slice(-18)}`,
            creator_id: s.metadata?.creator_id || "cmc-visuals",
            name: s.customer_details?.name || "",
            email: s.customer_details?.email || "",
            phone: s.customer_details?.phone || "",
            amount: (s.amount_total || 0) / 100,
            product: s.metadata?.product || "",
            status: "Paid",
            stripe_session_id: s.id,
            parental_consent: !!s.consent?.terms_of_service,
          });
          if (s.customer_details?.email) await sendConfirmationEmail(s.customer_details.email, s.customer_details.name, s.metadata?.product);
        } else if (s.mode === "subscription") {
          const member = {
            id: `mem_${s.id.slice(-18)}`,
            name: s.customer_details?.name || "",
            email: s.customer_details?.email || "",
            phone: s.customer_details?.phone || "",
            tier: s.metadata?.tier || "basic",
            status: "active",
            stripe_customer_id: s.customer,
            stripe_subscription_id: s.subscription,
            started_at: new Date().toISOString(),
          };
          await db.from("coaching_members").upsert(member, { onConflict: "email" });
          await grantCommunityAccess(member);
        }
        break;
      }
      case "invoice.payment_failed": {
        const sub = event.data.object.subscription;
        if (sub) await db.from("coaching_members").update({ status: "past_due" }).eq("stripe_subscription_id", sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object.id;
        const { data: m } = await db.from("coaching_members").update({ status: "cancelled" }).eq("stripe_subscription_id", sub).select().maybeSingle();
        if (m) await revokeCommunityAccess(m);
        break;
      }
      case "customer.subscription.updated": {
        const o = event.data.object;
        if (o.status === "active") {
          const { data: m } = await db.from("coaching_members").update({ status: "active" }).eq("stripe_subscription_id", o.id).select().maybeSingle();
          if (m) await grantCommunityAccess(m);
        }
        break;
      }
    }
    await db.from("webhook_events").update({ processed: true }).eq("id", event.id);
  } catch (err) {
    console.error("webhook handler error:", err.message);
    await db.from("webhook_events").update({ error: err.message }).eq("id", event.id);
    return NextResponse.json({ received: true, warning: "handler_error" });
  }

  return NextResponse.json({ received: true });
}
