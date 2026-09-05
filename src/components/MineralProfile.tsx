"use client";

import { useEffect, useRef, useState } from "react";

const minerals = [
  { label: "pH Balance", value: 7.8, display: "7.8", unit: "", badge: "Optimal Alkalinity", desc: "Balanced to support cellular hydration and metabolic efficiency.", color: "#4a9eca" },
  { label: "TDS", value: 45, display: "45", unit: "mg/L", badge: "Ultra-Light Purity", desc: "Exceptionally low dissolved solids for the cleanest, purest taste.", color: "#a8d8f0" },
  { label: "Silica", value: 14, display: "14", unit: "mg/L", badge: "Skin & Collagen", desc: "Natural silica for skin elasticity and connective tissue support.", color: "#c9a84c" },
  { label: "Electrolytes", value: 100, display: "Balanced", unit: "", badge: "Mg²⁺ & Ca²⁺", desc: "Naturally balanced magnesium and calcium for peak hydration.", color: "#7ec8e3" },
];

function AnimatedNumber({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const done = useRef(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const start = Date.now();
        const tick = () => {
          const t = Math.min((Date.now() - start) / 1400, 1);
          setCount(Math.round((1 - Math.pow(1 - t, 3)) * target));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [target]);
  return <span ref={ref}>{count}</span>;
}

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
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)", marginBottom: 10, display: "inline-block" }}>Purity Metrics</span>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700, color: "#0a1628", marginTop: 10 }}>The Mineral Profile</h2>
          </div>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.64rem", letterSpacing: "0.12em", color: "rgba(26,58,92,0.4)", textTransform: "uppercase", textAlign: "right" }}>ISO 9001 Certified<br />Lab verified quarterly</p>
        </div>

        {/* 2×2 Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {minerals.map((m, i) => (
            <div key={m.label} className="reveal" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div style={{ padding: "22px 24px", background: "rgba(255,255,255,0.97)", border: `1px solid ${m.color}44`, borderRadius: "6px", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", boxShadow: "0 2px 20px rgba(74,158,202,0.08)", display: "flex", gap: 20, alignItems: "center", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(74,158,202,0.06)"; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.9)"; el.style.transform = "none"; }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: 50, height: 50, background: `linear-gradient(225deg,${m.color}18,transparent)` }} />

                {/* Big number */}
                <div style={{ minWidth: 90 }}>
                  <div style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, color: m.color, lineHeight: 1, marginBottom: 4 }}>
                    {m.display === "Balanced"
                      ? <span style={{ fontSize: "1.2rem" }}>Balanced</span>
                      : <><AnimatedNumber target={m.value} />{m.unit && <span style={{ fontSize: "0.75rem", color: "rgba(26,58,92,0.5)", marginLeft: 3 }}>{m.unit}</span>}</>}
                  </div>
                  <div style={{ height: 2, background: "rgba(74,158,202,0.15)", borderRadius: 1, width: "70%", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(m.value / (m.label === "pH Balance" ? 14 : m.label === "TDS" ? 500 : m.label === "Silica" ? 50 : 100)) * 100}%`, background: `linear-gradient(90deg,${m.color},${m.color}60)` }} />
                  </div>
                </div>

                {/* Text */}
                <div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: m.color, fontWeight: 700, marginBottom: 4 }}>{m.label}</p>
                  <div style={{ display: "inline-flex", padding: "2px 8px", background: `${m.color}14`, border: `1px solid ${m.color}28`, borderRadius: "10px", marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.56rem", letterSpacing: "0.1em", textTransform: "uppercase", color: m.color, fontWeight: 700 }}>{m.badge}</span>
                  </div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.76rem", lineHeight: 1.6, color: "rgba(26,58,92,0.65)" }}>{m.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
