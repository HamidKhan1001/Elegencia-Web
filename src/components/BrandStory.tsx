"use client";

import { useEffect, useRef } from "react";
import VideoEmbed from "./VideoEmbed";
import CertificateGrid from "./CertificateGrid";
import { CERTIFICATES } from "@/lib/certificates";
import { withBasePath } from "@/lib/basePath";

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
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)" }}>Made in Peshawar</span>
        </div>

        <div className="reveal-left" style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.6rem,3.2vw,2.8rem)", fontWeight: 700, lineHeight: 1.15, color: "#0a1628", marginBottom: 20, maxWidth: 620 }}>
            Bottled in Peshawar, Pakistan
          </h2>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(26,58,92,0.7)", marginBottom: 28, maxWidth: 620 }}>
            Elegancià is bottled at Plot No. 84-A, Industrial Estate, Hayatabad, Peshawar, under license from the KP Food Safety and Halal Food Authority and the Pakistan Standards and Quality Control Authority.
          </p>
          {/* Stats */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {[["0", "Artificial additives"], ["PS 4639:2018", "Pakistan Standard"]].map(([num, label]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", background: "rgba(74,158,202,0.05)", border: "1px solid rgba(74,158,202,0.12)", borderRadius: "4px" }}>
                <span style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", fontWeight: 700, color: "#4a9eca" }}>{num}</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.78rem", color: "#1a3a5c" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Real certificates, not a claim about them — click any one to read it in full */}
        <div className="reveal-right">
          <CertificateGrid certificates={CERTIFICATES} />
          <p style={{ marginTop: 16, fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem" }}>
            <a href={withBasePath("/license")} style={{ color: "#4a9eca", fontWeight: 600, textDecoration: "none" }}>See all license details →</a>
          </p>
        </div>

        {/* Video: click-to-load, so it costs nothing until someone actually plays it */}
        <div className="reveal" style={{ marginTop: 56, maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, textAlign: "center", marginBottom: 18 }}>
            See It For Yourself
          </p>
          <VideoEmbed youtubeId="cwrkrQe3nHo" title="Elegancià, from source to bottle" />
        </div>
      </div>
    </div>
  );
}
