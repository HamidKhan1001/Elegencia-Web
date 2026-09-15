"use client";

import { useEffect, useRef } from "react";

// Deterministic pseudo-random (not Math.random()) — a value from Math.random()
// evaluated at module scope differs between the server render and the
// client's first render, which is a React hydration mismatch on every load.
const seed = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const snowflakes = Array.from({ length: 14 }, (_, i) => ({ id: i, left: seed(i * 4) * 100, delay: seed(i * 4 + 1) * 10, duration: 8 + seed(i * 4 + 2) * 8, size: 1.5 + seed(i * 4 + 3) * 2.5 }));

export default function BrandStory() {
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
      id="source"
      ref={ref}
      style={{
        minHeight: "100vh", width: "100%",
        background: "linear-gradient(160deg, #f0f8ff 0%, #e8f4fd 100%)",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "80px 0",
      }}
    >
      {/* Top border highlight */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(74,158,202,0.5),transparent)" }} />

      {/* Snow */}
      {snowflakes.map((sf) => (
        <div key={sf.id} style={{ position: "absolute", left: `${sf.left}%`, top: "-20px", width: `${sf.size}px`, height: `${sf.size}px`, borderRadius: "50%", background: "rgba(74,158,202,0.4)", animation: `snow-drift ${sf.duration}s ${sf.delay}s linear infinite`, pointerEvents: "none" }} />
      ))}

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px", width: "100%", position: "relative", zIndex: 1 }}>

        {/* Section tag */}
        <div className="reveal" style={{ marginBottom: 32 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)" }}>The Pure Origin</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 48, alignItems: "start" }}>

          {/* Left */}
          <div className="reveal-left">
            <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.6rem,3.2vw,2.8rem)", fontWeight: 700, lineHeight: 1.15, color: "#0a1628", marginBottom: 20 }}>
              Sourced with Care, Bottled with Purpose
            </h2>
            <p style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(0.88rem,1.3vw,1rem)", lineHeight: 1.8, color: "#1a3a5c", marginBottom: 20, fontStyle: "italic" }}>
              &ldquo;Every bottle carries the same standard — clean at the source, untouched all the way to the bottle.&rdquo;
            </p>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.85rem", lineHeight: 1.8, color: "rgba(26,58,92,0.65)", marginBottom: 28 }}>
              Harvested through a closed-loop, zero-contact process. From the source to the bottle, it never touches the open air.
            </p>
            {/* Stats */}
            {[["100%", "Naturally sourced"], ["0", "Artificial additives"], ["ISO 9001", "Certified process"]].map(([num, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 18, padding: "12px 18px", marginBottom: 8, background: "rgba(74,158,202,0.05)", border: "1px solid rgba(74,158,202,0.12)", borderRadius: "4px" }}>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: "1.3rem", fontWeight: 700, color: "#4a9eca", minWidth: 100 }}>{num}</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.78rem", color: "#1a3a5c" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Right — 3 pillars */}
          <div className="reveal-right" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { icon: "◈", title: "Natural Origin", desc: "Sourced from natural springs, protected from contact with the surrounding environment." },
              { icon: "◆", title: "Zero Contamination", desc: "Closed-loop collection ensures the water never contacts the open atmosphere." },
              { icon: "◇", title: "Natural Filtration", desc: "Filtered through natural mineral rock — balanced minerals, zero additives." },
            ].map((p) => (
              <div key={p.title} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.96)", border: "1px solid rgba(74,158,202,0.22)", borderRadius: "6px", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", boxShadow: "0 2px 20px rgba(74,158,202,0.13)", transition: "all 0.3s ease" }}
                onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(74,158,202,0.08)"; el.style.borderColor = "rgba(74,158,202,0.35)"; el.style.transform = "translateX(4px)"; }}
                onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.8)"; el.style.borderColor = "rgba(74,158,202,0.2)"; el.style.transform = "none"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: "1.2rem", color: "#4a9eca" }}>{p.icon}</span>
                  <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: "0.78rem", fontWeight: 700, color: "#0a1628", letterSpacing: "0.08em", textTransform: "uppercase" }}>{p.title}</h3>
                </div>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.78rem", lineHeight: 1.65, color: "rgba(26,58,92,0.65)", paddingLeft: 30 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
