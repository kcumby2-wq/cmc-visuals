"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("creator");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRole(params.get("role") || "creator");
    fetch(`/api/dashboard?role=${params.get("role") || "creator"}`)
      .then((r) => r.json()).then(setData).catch(() => setData({ error: "Dashboard API not wired yet — Claude Code adds auth + /api/dashboard" }));
  }, []);

  const card = { background: "#1a1a1a", border: "1px solid rgba(225,15,28,0.22)", borderRadius: 12, padding: 18 };
  return (
    <div style={{ maxWidth: 1000, margin: "30px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 24 }}>Operations Dashboard <span style={{ fontSize: 12, color: "#ff2433" }}>· {role}</span></h1>
      {!data && <p style={{ color: "rgba(255,255,255,0.5)" }}>Loading…</p>}
      {data?.error && <div style={{ ...card, color: "#ffb86b" }}>{data.error}</div>}
      {data?.stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginTop: 16 }}>
          <div style={card}><div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Total revenue</div><div style={{ fontSize: 26, fontWeight: 800 }}>${data.stats.revenue}</div></div>
          <div style={card}><div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Orders</div><div style={{ fontSize: 26, fontWeight: 800 }}>{data.stats.orders}</div></div>
          <div style={card}><div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Subscribers</div><div style={{ fontSize: 26, fontWeight: 800 }}>{data.stats.subs}</div></div>
          {data.stats.canViewPayouts && <div style={card}><div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Creator payout (80%)</div><div style={{ fontSize: 26, fontWeight: 800 }}>${data.stats.payout}</div></div>}
        </div>
      )}
      <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 24 }}>
        Empty states, live tables, CSV export, and the auth provider are wired by Claude Code per DEPLOY.md. Schema + role scoping (scope.js) are ready.
      </p>
    </div>
  );
}
