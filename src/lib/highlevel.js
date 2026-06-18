/* ============================================================
   HIGHLEVEL BRIDGE — grant/revoke community access.
   Paid subscription → added to the HighLevel community within
   seconds. Cancel/final-failure → removed. Source of truth is
   YOUR site + Stripe; HL is where the community lives.
   ============================================================ */
import SM from "@/config/subjectmedia.config.js";

async function callHL(action, member) {
  const url = process.env.HL_INBOUND_WEBHOOK_URL || SM.coachingMembership.highlevel.inboundWebhookUrl;
  if (!url || url.includes("REPLACE")) {
    console.warn(`HL bridge not configured — skipping ${action} for ${member.email}`);
    return;
  }
  const [firstName, ...rest] = (member.name || "").split(" ");
  const payload = {
    email: member.email,
    firstName: firstName || "",
    lastName: rest.join(" "),
    phone: member.phone || "",
    tier: member.tier || "basic",
    action,
  };
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`HL ${action} failed: ${res.status}`);
}

export async function grantCommunityAccess(member)  { return callHL("grant", member); }
export async function revokeCommunityAccess(member) { return callHL("revoke", member); }
