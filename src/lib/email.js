/* ============================================================
   EMAIL — buyer confirmation + delivery notification (Resend).
   Fails soft: a missing email key never blocks a sale.
   ============================================================ */
import { Resend } from "resend";

function client() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.includes("REPLACE")) return null;
  return new Resend(key);
}

export async function sendConfirmationEmail(to, name, product) {
  const r = client();
  if (!r) { console.warn("email skipped — RESEND_API_KEY not set"); return; }
  try {
    await r.emails.send({
      from: process.env.FROM_EMAIL || "hello@subjectmedias.com",
      to,
      subject: "Your coverage is booked — here's what happens next",
      html: `<p>Hi ${name || "there"},</p>
        <p>Thanks for booking <strong>${product || "coverage"}</strong>. Your spot is confirmed.</p>
        <p>What happens next: we capture your content at the event, edit it, and deliver within 48 hours. You'll get an email the moment it's ready.</p>
        <p>— The CMC Visuals team</p>`,
    });
  } catch (err) { console.error("email send failed:", err.message); }
}

export async function sendDeliveryEmail(to, name) {
  const r = client();
  if (!r) return;
  try {
    await r.emails.send({
      from: process.env.FROM_EMAIL || "hello@subjectmedias.com",
      to,
      subject: "Your content is ready",
      html: `<p>Hi ${name || "there"},</p><p>Your media is edited and ready. Check your delivery link.</p><p>— CMC Visuals</p>`,
    });
  } catch (err) { console.error("delivery email failed:", err.message); }
}
