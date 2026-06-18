"use client";
import { useState } from "react";
import CREATOR from "@/config/creator.config.js";

export default function Home() {
  const [loading, setLoading] = useState("");
  async function buy(packageId) {
    setLoading(packageId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert(data.error || "Checkout unavailable");
    } catch { alert("Checkout failed"); }
    setLoading("");
  }
  const t = CREATOR.theme;
  const wrap = { maxWidth: 1000, margin: "0 auto", padding: "0 20px" };
  const card = { background: t.bgCard, border: `1px solid ${t.primary}33`, borderRadius: 14, padding: 24, position: "relative" };
  const btn = (featured) => ({ width: "100%", padding: 12, marginTop: 14, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", border: featured ? "none" : `1px solid ${t.primary}55`, background: featured ? t.primary : "transparent", color: featured ? "#fff" : t.accent });

  return (
    <main>
      <section style={{ ...wrap, paddingTop: 70, textAlign: "center" }}>
        <div style={{ fontSize: 12, letterSpacing: 2, color: t.accent, textTransform: "uppercase" }}>{CREATOR.businessName} · {CREATOR.handle}</div>
        <h1 style={{ fontSize: 46, lineHeight: 1.05, margin: "16px 0" }}>
          {CREATOR.heroHeadline.map((l, i) => <div key={i} style={{ color: i === 1 ? t.accent : "#fff" }}>{l}</div>)}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto", lineHeight: 1.6 }}>{CREATOR.tagline}</p>
      </section>

      <section style={{ ...wrap, paddingTop: 50, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
        {CREATOR.packages.map((p) => (
          <div key={p.id} style={{ ...card, borderColor: p.featured ? `${t.primary}88` : `${t.primary}33` }}>
            {p.featured && <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", background: t.primary, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: "3px 14px", borderRadius: 20 }}>MOST POPULAR</div>}
            <div style={{ fontSize: 28 }}>{p.icon}</div>
            <h3 style={{ margin: "8px 0 4px" }}>{p.name}</h3>
            <div style={{ fontSize: 32, fontWeight: 800 }}>${p.price}</div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>{p.desc}</p>
            <ul style={{ listStyle: "none", padding: 0, fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              {p.features.map((f, i) => <li key={i} style={{ padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>✓ {f}</li>)}
            </ul>
            <button style={btn(p.featured)} disabled={loading === p.id} onClick={() => buy(p.id)}>{loading === p.id ? "…" : "BOOK NOW"}</button>
          </div>
        ))}
      </section>

      {CREATOR.teamTier?.show && (
        <section style={{ ...wrap, paddingTop: 30 }}>
          <div style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, borderColor: `${t.gold}44` }}>
            <div><h3 style={{ margin: 0 }}>{CREATOR.teamTier.name}</h3><p style={{ color: "rgba(255,255,255,0.55)", fontSize: 13, margin: "4px 0 0" }}>{CREATOR.teamTier.desc}</p></div>
            <button style={{ ...btn(true), width: "auto", padding: "10px 24px", background: t.gold, color: "#0a0a0a" }} onClick={() => buy("team")}>BOOK TEAM · ${CREATOR.teamTier.price}</button>
          </div>
        </section>
      )}

      <footer style={{ textAlign: "center", padding: 40, fontSize: 11, letterSpacing: 1, color: "rgba(255,255,255,0.35)" }}>
        {CREATOR.footerNote} · All sales are final.
      </footer>
    </main>
  );
}
