"use client";

import { useEffect, useRef } from "react";

const features = [
  { icon: "♻", title: "100% Recyclable PET", desc: "40% less plastic than industry standard, full structural integrity maintained.", stat: "40% Less Plastic", color: "#4a9eca" },
  { icon: "◯", title: "Featherweight Design", desc: "The 500ml bottle weighs just 8.4g — lighter than a standard sheet of paper.", stat: "8.4g Only", color: "#a8d8f0" },
  { icon: "◈", title: "Eco Sky-Blue Cap", desc: "Bio-based polymers, fully recyclable through standard municipal systems.", stat: "Bio-Based", color: "#7ec8e3" },
  { icon: "✦", title: "Responsible Shipping", desc: "Delivery emissions offset through verified reforestation programs.", stat: "Offset", color: "#c9a84c" },
];

// Deterministic pseudo-random (not Math.random()) — a value from Math.random()
// evaluated at module scope differs between the server render and the
// client's first render, which is a React hydration mismatch on every load.
const seed = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const snowflakes = Array.from({ length: 12 }, (_, i) => ({ id: i, left: seed(i * 4) * 100, delay: seed(i * 4 + 1) * 12, duration: 9 + seed(i * 4 + 2) * 8, size: 1.5 + seed(i * 4 + 3) * 2.5 }));

export default function Sustainability() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll(".reveal,.reveal-left,.reveal-right").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      id="purity"
      ref={ref}
      style={{
        minHeight: "100vh", width: "100%",
        background: "linear-gradient(160deg, #f0f8ff 0%, #e8f4fd 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 0",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(74,158,202,0.35),transparent)" }} />
      {snowflakes.map((sf) => (
        <div key={sf.id} style={{ position: "absolute", left: `${sf.left}%`, top: "-20px", width: `${sf.size}px`, height: `${sf.size}px`, borderRadius: "50%", background: "rgba(74,158,202,0.4)", animation: `snow-drift ${sf.duration}s ${sf.delay}s linear infinite`, pointerEvents: "none" }} />
      ))}

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px", width: "100%", position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "center" }}>

          {/* Left — heading */}
          <div className="reveal-left">
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)", marginBottom: 16, display: "inline-block" }}>Sustainability & Craftsmanship</span>
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.6rem,3.2vw,2.8rem)", fontWeight: 700, lineHeight: 1.15, color: "#0a1628", marginTop: 14, marginBottom: 18 }}>Luxury Without<br />Compromise</h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.88rem", lineHeight: 1.82, color: "rgba(26,58,92,0.68)", maxWidth: 360, marginBottom: 28 }}>Premium water should also be responsible water. Every bottle is designed to minimize environmental impact without compromising quality.</p>

            {/* Big stat circle */}
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 120, height: 120, borderRadius: "50%", border: "1px solid rgba(74,158,202,0.2)", background: "rgba(74,158,202,0.05)" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "'Cinzel',serif", fontSize: "1.8rem", fontWeight: 700, color: "#4a9eca", lineHeight: 1 }}>100%</p>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.52rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(26,58,92,0.55)", marginTop: 4 }}>Recyclable</p>
              </div>
            </div>
          </div>

          {/* Right — 2×2 grid */}
          <div className="reveal-right" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12 }}>
            {features.map((f) => (
              <div key={f.title} style={{ padding: "18px 16px", background: "rgba(255,255,255,0.97)", border: "1px solid rgba(74,158,202,0.22)", borderRadius: "6px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 2px 16px rgba(74,158,202,0.08)", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(74,158,202,0.06)"; el.style.borderColor = "rgba(74,158,202,0.24)"; el.style.transform = "translateY(-3px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.85)"; el.style.borderColor = "rgba(74,158,202,0.18)"; el.style.transform = "none"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: "1.2rem", color: f.color }}>{f.icon}</span>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.52rem", color: f.color, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700, background: `${f.color}12`, padding: "2px 7px", borderRadius: "8px" }}>{f.stat}</span>
                </div>
                <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: "0.74rem", fontWeight: 700, color: "#0a1628", marginBottom: 8, letterSpacing: "0.06em", textTransform: "uppercase" }}>{f.title}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.74rem", lineHeight: 1.65, color: "rgba(26,58,92,0.65)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
