"use client";
import { useState } from "react";

export default function OnboardPage() {
  const [form, setForm] = useState({
    creatorBusinessName: "", creatorHandle: "", location: "",
    creatorEmail: "", parentName: "", parentEmail: "", splitPercent: 80,
  });
  const [step, setStep] = useState("form");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function provision() {
    setError(""); setStep("provisioning");
    try {
      const res = await fetch("/api/onboard", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Onboarding failed");
      setResult(data); setStep("connect");
    } catch (e) { setError(e.message); setStep("form"); }
  }

  const card = { background: "#1a1a1a", border: "1px solid rgba(225,15,28,0.22)", borderRadius: 14, padding: 28, maxWidth: 520, margin: "40px auto" };
  const input = { width: "100%", padding: "11px 14px", margin: "6px 0 16px", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#f5f5f5", fontSize: 14, boxSizing: "border-box" };
  const label = { fontSize: 12, letterSpacing: 1, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" };
  const btn = { width: "100%", padding: 13, background: "#e10f1c", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 };

  return (
    <div style={card}>
      <div style={{ fontSize: 12, letterSpacing: 2, color: "#ff2433", textTransform: "uppercase", marginBottom: 6 }}>Subject Media · Creator Onboarding</div>
      <h1 style={{ fontSize: 24, margin: "0 0 6px" }}>Set up your creator account</h1>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.6, marginTop: 0 }}>
        Parent or guardian completes this. It creates your athlete's media business and the payout account you control. You keep {form.splitPercent}% of every sale.
      </p>

      {step === "form" && (
        <>
          <div style={label}>Creator business name</div>
          <input style={input} value={form.creatorBusinessName} onChange={set("creatorBusinessName")} placeholder="e.g. CMC Visuals" />
          <div style={label}>Social handle</div>
          <input style={input} value={form.creatorHandle} onChange={set("creatorHandle")} placeholder="@handle" />
          <div style={label}>Coverage area</div>
          <input style={input} value={form.location} onChange={set("location")} placeholder="City, State" />
          <div style={label}>Creator email (the kid)</div>
          <input style={input} type="email" value={form.creatorEmail} onChange={set("creatorEmail")} placeholder="creator@email.com" />
          <div style={label}>Parent / guardian name</div>
          <input style={input} value={form.parentName} onChange={set("parentName")} placeholder="Your name" />
          <div style={label}>Parent / guardian email (controls payouts)</div>
          <input style={input} type="email" value={form.parentEmail} onChange={set("parentEmail")} placeholder="parent@email.com" />
          {error && <div style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 10 }}>{error}</div>}
          <button style={btn} onClick={provision}>Create account &amp; continue</button>
        </>
      )}

      {step === "provisioning" && <p style={{ textAlign: "center", padding: 30 }}>Setting up the account…</p>}

      {step === "connect" && result && (
        <>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>
            Account created. The last step is Stripe's secure setup — you'll verify identity and add the bank account where payouts land. This is controlled entirely by you, the guardian.
          </p>
          <a href={result.onboardingUrl} style={{ ...btn, display: "block", textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>
            Complete payout setup with Stripe
          </a>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 14 }}>
            After this, you'll subscribe to activate the tools and join the SubjectSkillz community. Your creator URL: {result.slug}
          </p>
        </>
      )}
    </div>
  );
}
