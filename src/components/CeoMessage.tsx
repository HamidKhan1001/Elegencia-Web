"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { withBasePath } from "@/lib/basePath";

export default function CeoMessage() {
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
      ref={ref}
      style={{
        width: "100%",
        background: "linear-gradient(160deg, #0a1628 0%, #10233d 55%, #0a1628 100%)",
        position: "relative", overflow: "hidden",
        padding: "100px 0",
      }}
    >
      {/* Top border highlight, matching the rest of the site's section seams */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(74,158,202,0.5),transparent)" }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px", width: "100%", position: "relative", zIndex: 1 }}>
        <div className="reveal" style={{ marginBottom: 32, textAlign: "center" }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.35)", borderRadius: "20px", background: "rgba(74,158,202,0.08)" }}>A Message From Our Founder</span>
        </div>

        <div className="ceo-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 56, alignItems: "center" }}>
          <div className="reveal-left ceo-photo-wrap" style={{ justifySelf: "center" }}>
            <div style={{
              width: 240, height: 300, borderRadius: "10px", overflow: "hidden",
              border: "1px solid rgba(74,158,202,0.3)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)", position: "relative",
            }}>
              <Image
                src={withBasePath("/ceo-sufyan.jpeg")}
                alt="M. Sufyan Rasheed, Founder & CEO of Elegancià"
                fill
                sizes="240px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>

          <div className="reveal-right">
            <p style={{
              fontFamily: "'Playfair Display',serif", fontStyle: "italic",
              fontSize: "clamp(1.05rem,1.9vw,1.5rem)", lineHeight: 1.75,
              color: "#eaf4fb", marginBottom: 28,
            }}>
              &ldquo;Elegancià was never meant to be just another bottle on a shelf. Every liter we bottle carries a promise, both to the source it comes from and to the person who trusts us enough to drink it. That promise is the only thing we&apos;re really in the business of keeping.&rdquo;
            </p>
            <h3 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.05rem", fontWeight: 700, letterSpacing: "0.04em", color: "#ffffff", marginBottom: 4 }}>
              M. Sufyan Rasheed
            </h3>
            <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 600 }}>
              Founder &amp; CEO, Elegancià
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
