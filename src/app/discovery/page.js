"use client";
/* ============================================================
   DISCOVERY FORM — Stage 1 of the Trail of Joy build pipeline.
   Captured on (or right after) the discovery call. Output maps
   1:1 to the intake JSON that feeds ECO-STRAT (stage 2).
   This is the front door to the whole company factory.
   ============================================================ */
import { useState } from "react";

const FIELDS = [
  { k: "companyName",   label: "Company / brand name", ph: "e.g. CMC Visuals" },
  { k: "ownerName",     label: "Owner name", ph: "Who runs it day to day" },
  { k: "ownerEmail",    label: "Owner email", type: "email", ph: "owner@email.com" },
  { k: "guardianEmail", label: "Parent/guardian email (if creator is a minor)", type: "email", ph: "optional" },
  { k: "whatTheyDo",    label: "What does the business do?", area: true, ph: "One or two sentences in their words" },
  { k: "whoTheyServe",  label: "Who do they serve?", area: true, ph: "Target customer / audience" },
  { k: "offers",        label: "What do they sell? (offers + rough prices)", area: true, ph: "e.g. Photo $49, Video $99, Team $399" },
  { k: "revenueModel",  label: "How does money come in?", ph: "one-time / subscription / split / retainer" },
  { k: "usesGHL",       label: "Will this use GoHighLevel?", select: ["Yes — GHL CRM", "No — standalone", "Not sure"] },
  { k: "splitPercent",  label: "Revenue split to the creator/owner (%)", ph: "e.g. 80" },
  { k: "domain",        label: "Domain (if any)", ph: "leave blank if none yet" },
  { k: "goals90",       label: "Top goal for the next 90 days", area: true, ph: "The one thing that matters most" },
];

export default function DiscoveryForm() {
  const [v, setV] = useState({});
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  function generate() {
    // Stage 1 output = intake JSON for ECO-STRAT (stage 2). No backend needed —
    // this is a call tool; the JSON is copied into the pipeline.
    const intake = { stage: "discovery", capturedAt: new Date().toISOString(), ...v };
    navigator.clipboard?.writeText(JSON.stringify(intake, null, 2)).catch(() => {});
    setDone(intake);
  }

  const wrap = { maxWidth: 600, margin: "30px auto", padding: "0 20px", color: "#f5f5f5", fontFamily: "system-ui" };
  const input = { width: "100%", padding: "11px 14px", margin: "6px 0 16px", background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 8, color: "#f5f5f5", fontSize: 14, boxSizing: "border-box" };
  const label = { fontSize: 12, letterSpacing: 1, color: "rgba(255,255,255,0.6)", textTransform: "uppercase" };
  const btn = { width: "100%", padding: 14, background: "#e10f1c", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" };

  return (
    <div style={wrap}>
      <div style={{ fontSize: 12, letterSpacing: 2, color: "#ff2433", textTransform: "uppercase" }}>Trail of Joy · Stage 1</div>
      <h1 style={{ fontSize: 26, margin: "8px 0 4px" }}>Discovery</h1>
      <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>Fill this during the discovery call. The output feeds the build pipeline.</p>
      {FIELDS.map((f) => (
        <div key={f.k}>
          <div style={label}>{f.label}</div>
          {f.select ? (
            <select style={input} value={v[f.k] || ""} onChange={set(f.k)}>
              <option value="">Select…</option>
              {f.select.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : f.area ? (
            <textarea style={{ ...input, minHeight: 64 }} value={v[f.k] || ""} onChange={set(f.k)} placeholder={f.ph} />
          ) : (
            <input style={input} type={f.type || "text"} value={v[f.k] || ""} onChange={set(f.k)} placeholder={f.ph} />
          )}
        </div>
      ))}
      <button style={btn} onClick={generate}>Generate intake JSON →</button>
      {done && (
        <pre style={{ marginTop: 18, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: 14, fontSize: 12, overflow: "auto", color: "#9fe6a0" }}>
{JSON.stringify(done, null, 2)}
        </pre>
      )}
      {done && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>Copied to clipboard. Paste into the pipeline to run Stage 2 (ECO-STRAT analysis).</p>}
    </div>
  );
}
