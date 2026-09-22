"use client";

import { useState } from "react";

interface Certificate {
  src: string;
  title: string;
  meta: string;
}

// Thumbnails are legible at a glance, but these are scanned certificates
// with fine print (registration numbers, validity dates) — click-to-enlarge
// is what makes that print actually readable without leaving the page.
export default function CertificateGrid({ certificates }: { certificates: Certificate[] }) {
  const [open, setOpen] = useState<Certificate | null>(null);

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {certificates.map((c) => (
          <button
            key={c.src}
            onClick={() => setOpen(c)}
            style={{
              display: "block", textAlign: "left", cursor: "zoom-in",
              background: "rgba(255,255,255,0.97)",
              border: "1px solid rgba(74,158,202,0.2)", borderRadius: "10px",
              overflow: "hidden", padding: 0,
              boxShadow: "0 2px 20px rgba(74,158,202,0.08)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.src} alt={c.title} loading="lazy" decoding="async" style={{ width: "100%", display: "block", aspectRatio: "4 / 3", objectFit: "cover" }} />
            <div style={{ padding: "14px 16px" }}>
              <p style={{ fontFamily: "'Cinzel',serif", fontSize: "0.9rem", fontWeight: 700, color: "#0a1628", marginBottom: 4 }}>{c.title}</p>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.76rem", color: "rgba(26,58,92,0.55)" }}>{c.meta}</p>
            </div>
          </button>
        ))}
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(10,22,40,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, cursor: "zoom-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={open.src}
            alt={open.title}
            style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
          />
        </div>
      )}
    </>
  );
}
