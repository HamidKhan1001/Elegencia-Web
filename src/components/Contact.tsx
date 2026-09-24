"use client";

import { useEffect, useRef } from "react";

const CHANNELS = [
  {
    icon: "☎",
    label: "Phone",
    value: "+92 310 3535597",
    href: "tel:+923103535597",
    color: "#4a9eca",
  },
  {
    icon: "✉",
    label: "Sales",
    value: "sales@elegancia.com.pk",
    href: "mailto:sales@elegancia.com.pk",
    color: "#3fb3dd",
  },
  {
    icon: "✉",
    label: "General Inquiries",
    value: "info@elegancia.com.pk",
    href: "mailto:info@elegancia.com.pk",
    color: "#7ec8e3",
  },
  {
    icon: "⌂",
    label: "Head Office",
    value: "Plot No. 84 A, Main Industrial Estate, Hayatabad, Peshawar, Pakistan",
    href: undefined,
    color: "#c9a84c",
  },
];

export default function Contact() {
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
      id="contact"
      ref={ref}
      style={{
        width: "100%",
        background: "linear-gradient(180deg, #f8fbff 0%, #edf6fd 100%)",
        position: "relative", overflow: "hidden",
        padding: "80px 0",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(74,158,202,0.4),transparent)" }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px", width: "100%", position: "relative", zIndex: 1 }}>

        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)", marginBottom: 12, display: "inline-block" }}>Get In Touch</span>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.5rem,2.8vw,2.4rem)", fontWeight: 700, color: "#0a1628", marginTop: 12 }}>Contact Us</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
          {CHANNELS.map((c) => {
            const card = (
              <div style={{ padding: "22px 24px", height: "100%", background: "rgba(255,255,255,0.97)", border: `1px solid ${c.color}44`, borderRadius: "6px", boxShadow: "0 2px 20px rgba(74,158,202,0.08)", display: "flex", flexDirection: "column", gap: 10, transition: "all 0.3s ease" }}>
                <span style={{ fontSize: "1.3rem", color: c.color }}>{c.icon}</span>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: c.color, fontWeight: 700 }}>{c.label}</p>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.9rem", lineHeight: 1.6, color: "#0a1628", fontWeight: 600 }}>{c.value}</p>
              </div>
            );
            return (
              <div key={c.label} className="reveal">
                {c.href ? (
                  <a
                    href={c.href}
                    style={{ display: "block", height: "100%", textDecoration: "none" }}
                    onMouseEnter={(e) => { (e.currentTarget.firstChild as HTMLElement).style.transform = "translateY(-3px)"; }}
                    onMouseLeave={(e) => { (e.currentTarget.firstChild as HTMLElement).style.transform = "none"; }}
                  >
                    {card}
                  </a>
                ) : card}
              </div>
            );
          })}
        </div>

        <div className="reveal" style={{ textAlign: "center", marginTop: 32 }}>
          <a
            href="https://www.elegancia.com.pk/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.78rem", letterSpacing: "0.08em", color: "#4a9eca", textDecoration: "none", fontWeight: 600 }}
          >
            elegancia.com.pk
          </a>
        </div>
      </div>
    </div>
  );
}
