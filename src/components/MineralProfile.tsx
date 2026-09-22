"use client";

import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/basePath";

// Straight from the printed label — these are ranges, not single lab
// readings, so that's what's shown: no invented precision, no counting
// animation implying a single exact number.
const minerals = [
  { label: "Calcium", range: "10 – 65", unit: "mg/L", color: "#4a9eca" },
  { label: "Magnesium", range: "1 – 22", unit: "mg/L", color: "#a8d8f0" },
  { label: "Sodium", range: "1 – 15", unit: "mg/L", color: "#c9a84c" },
  { label: "Chloride", range: "20 – 100", unit: "mg/L", color: "#7ec8e3" },
  { label: "Potassium", range: "1 – 10", unit: "mg/L", color: "#3fb3dd" },
  { label: "pH", range: "6.5 – 8.5", unit: "", color: "#2fa9d6" },
  { label: "TDS", range: "130 – 250", unit: "mg/L", color: "#1a7fbf" },
];

// Deterministic pseudo-random (not Math.random()) — a value from Math.random()
// evaluated at module scope differs between the server render and the
// client's first render, which is a React hydration mismatch on every load.
const seed = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const snowflakes = Array.from({ length: 12 }, (_, i) => ({ id: i, left: seed(i * 4) * 100, delay: seed(i * 4 + 1) * 12, duration: 8 + seed(i * 4 + 2) * 8, size: 1.5 + seed(i * 4 + 3) * 2 }));

export default function MineralProfile() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      id="mineral-profile"
      ref={ref}
      style={{
        minHeight: "100vh", width: "100%",
        background: "linear-gradient(180deg, #ffffff 0%, #f0f8ff 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 0",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(74,158,202,0.4),transparent)" }} />
      {snowflakes.map((sf) => (
        <div key={sf.id} style={{ position: "absolute", left: `${sf.left}%`, top: "-20px", width: `${sf.size}px`, height: `${sf.size}px`, borderRadius: "50%", background: "rgba(74,158,202,0.4)", animation: `snow-drift ${sf.duration}s ${sf.delay}s linear infinite`, pointerEvents: "none" }} />
      ))}

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px", width: "100%", position: "relative", zIndex: 1 }}>

        <div className="reveal" style={{ marginBottom: 28, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)", marginBottom: 10, display: "inline-block" }}>Mineral Content</span>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700, color: "#0a1628", marginTop: 10 }}>What&apos;s in the Water</h2>
          </div>
          <a href={withBasePath("/ingredients-label.jpg")} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.7rem", letterSpacing: "0.08em", color: "#4a9eca", fontWeight: 600, textDecoration: "none" }}>
            View the printed label ↗
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {minerals.map((m, i) => (
            <div key={m.label} className="reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
              <div style={{ padding: "18px 20px", background: "rgba(255,255,255,0.97)", border: `1px solid ${m.color}44`, borderRadius: "6px", boxShadow: "0 2px 20px rgba(74,158,202,0.08)", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(74,158,202,0.06)"; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.9)"; el.style.transform = "none"; }}
              >
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: m.color, fontWeight: 700, marginBottom: 6 }}>{m.label}</p>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: "1.3rem", fontWeight: 700, color: "#0a1628" }}>
                  {m.range}{m.unit && <span style={{ fontSize: "0.7rem", fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 500, color: "rgba(26,58,92,0.5)", marginLeft: 4 }}>{m.unit}</span>}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem", color: "rgba(26,58,92,0.45)", marginTop: 16 }}>
          As printed on the bottle label, per Pakistan Standard PS: 4639/2018.
        </p>
      </div>
    </div>
  );
}
