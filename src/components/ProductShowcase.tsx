"use client";

import { useEffect, useRef, useState } from "react";
import { getCutout } from "./hero/cutoutCache";
import { withBasePath } from "@/lib/basePath";

// Three sizes, matching the hero exactly — not a single bottle plus packs.
// There's still no real 1500ml bottle photo, so this reuses the 500ml
// detail shot as a stand-in until a real one comes in — an inaccurate
// bottle shape/size, but that reads better here than an empty card.
const products = [
  { name: "500ml", subtitle: "12 × 500ml Pack", tag: "12-Pack", tagColor: "#c9a84c", features: ["12 × 500ml bottles"], qty: "×12", featured: true, img: withBasePath("/products/bottle-500ml-front.png") },
  { name: "1500ml", subtitle: "6 × 1.5L Pack", tag: "6-Pack", tagColor: "#7ec8e3", features: ["6 × 1.5L bottles"], qty: "×6", img: withBasePath("/products/bottle-500ml-detail.png") },
  { name: "19L", subtitle: "Dispenser · Doorstep Delivery", tag: "Dispenser", tagColor: "#1a7fbf", features: ["19L"], qty: "", img: withBasePath("/products/bottle-19l-v2.png") },
];

// Deterministic pseudo-random (not Math.random()) — a value from Math.random()
// evaluated at module scope differs between the server render and the
// client's first render, which is a React hydration mismatch on every load.
const seed = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const snowflakes = Array.from({ length: 12 }, (_, i) => ({ id: i, left: seed(i * 4) * 100, delay: seed(i * 4 + 1) * 12, duration: 8 + seed(i * 4 + 2) * 8, size: 1.5 + seed(i * 4 + 3) * 2 }));

export default function ProductShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [cutouts, setCutouts] = useState<Record<string, string>>({});

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.05 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Same background-removal pipeline the hero uses, and the same module
  // cache — if a visitor already scrolled past the hero, these resolve
  // instantly instead of recomputing the cutout.
  useEffect(() => {
    let cancelled = false;
    products.forEach((p) => {
      getCutout(p.img).then((cutout) => {
        if (cancelled) return;
        setCutouts((prev) => ({ ...prev, [p.img]: cutout.url }));
      }).catch(() => {});
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      id="order"
      ref={ref}
      style={{
        minHeight: "100vh", width: "100%",
        background: "linear-gradient(180deg, #f8fbff 0%, #edf6fd 100%)",
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

        <div className="reveal" style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)", marginBottom: 12, display: "inline-block" }}>Order</span>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700, color: "#0a1628", marginTop: 12 }}>Choose a Size</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {products.map((p, i) => (
            <div key={p.name} className="reveal" style={{ transitionDelay: `${i * 0.12}s` }} onClick={() => setActive(i)}>
              <div style={{
                padding: "24px 22px", borderRadius: "8px", cursor: "pointer",
                background: active === i ? "rgba(74,158,202,0.08)" : "rgba(255,255,255,0.97)",
                backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
                border: active === i ? `1px solid rgba(74,158,202,0.4)` : "1px solid rgba(74,158,202,0.1)",
                boxShadow: active === i ? "0 12px 50px rgba(74,158,202,0.2)" : "0 4px 24px rgba(74,158,202,0.1)",
                transform: active === i ? "translateY(-6px)" : "none",
                transition: "all 0.35s ease",
              }}>
                {/* Tag */}
                <div style={{ display: "inline-flex", padding: "3px 10px", background: `${p.tagColor}16`, border: `1px solid ${p.tagColor}28`, borderRadius: "12px", marginBottom: 16 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.56rem", letterSpacing: "0.12em", textTransform: "uppercase", color: p.tagColor, fontWeight: 700 }}>{p.tag}</span>
                </div>

                {/* Bottle */}
                <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 16 }}>
                  <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "60%", height: 14, background: `radial-gradient(ellipse,${p.tagColor}25,transparent)`, filter: "blur(6px)" }} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cutouts[p.img] || p.img} alt={p.name} loading="lazy" decoding="async" style={{ height: 110, objectFit: "contain", filter: active === i ? "brightness(1.1) saturate(1.2)" : "brightness(0.92) saturate(0.85)", transition: "filter 0.35s ease" }} />
                  {p.qty && <div style={{ position: "absolute", top: 4, right: 4, fontFamily: "'Cinzel',serif", fontSize: "1rem", fontWeight: 700, color: p.tagColor, opacity: 0.65 }}>{p.qty}</div>}
                </div>

                <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: "0.95rem", fontWeight: 700, color: "#0a1628", marginBottom: 3 }}>{p.name}</h3>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.62rem", color: p.tagColor, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12, fontWeight: 600 }}>{p.subtitle}</p>

                <ul style={{ listStyle: "none", marginBottom: 18 }}>
                  {p.features.map((feat) => (
                    <li key={feat} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: "1px solid rgba(74,158,202,0.12)", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.74rem", color: "#1a3a5c" }}>
                      <span style={{ color: p.tagColor, fontSize: "0.5rem" }}>◆</span>{feat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
