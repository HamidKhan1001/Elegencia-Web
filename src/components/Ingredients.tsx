"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCutout } from "./hero/cutoutCache";
import { withBasePath } from "@/lib/basePath";

const BOTTLE_SRC = withBasePath("/products/bottle-500ml-front.png");
const LABEL_SRC = withBasePath("/ingredients-label.png");

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Ingredients() {
  const [bottleUrl, setBottleUrl] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCutout(BOTTLE_SRC).then((c) => {
      if (!cancelled) setBottleUrl(c.url);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      id="ingredients"
      style={{
        width: "100%",
        background: "linear-gradient(180deg, #ffffff 0%, #f0f8ff 100%)",
        position: "relative", overflow: "hidden",
        padding: "90px 0",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg,transparent,rgba(74,158,202,0.4),transparent)" }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 40px", width: "100%", position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: EASE }}
          style={{ textAlign: "center", marginBottom: 48 }}
        >
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)", marginBottom: 14, display: "inline-block" }}>
            What&apos;s Inside
          </span>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.6rem,3.2vw,2.6rem)", fontWeight: 700, color: "#0a1628" }}>
            Straight Off the Label
          </h2>
        </motion.div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "clamp(24px, 6vw, 72px)" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
            style={{ position: "relative" }}
          >
            <div aria-hidden style={{
              position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
              width: 280, height: 280, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(74,158,202,0.16), transparent 70%)",
            }} />
            {bottleUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bottleUrl} alt="Elegancià 500ml bottle" style={{ height: 340, width: "auto", objectFit: "contain", filter: "drop-shadow(0 20px 30px rgba(10,22,40,0.2))", position: "relative", zIndex: 1 }} />
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 24, rotate: 4 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
            onClick={() => setZoomed(true)}
            aria-label="View the ingredient label full size"
            style={{ background: "none", border: "none", padding: 0, cursor: "zoom-in" }}
          >
            <div
              style={{
                borderRadius: 14, overflow: "hidden",
                boxShadow: "0 24px 60px rgba(10,22,40,0.22)",
                border: "1px solid rgba(74,158,202,0.2)",
              }}
            >
              {/* This is the real label printed on the bottle — not a
                  redrawn version — so what's here always matches what's
                  physically on the shelf. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LABEL_SRC} alt="Elegancià ingredient and mineral content label" loading="lazy" decoding="async" style={{ height: 340, width: "auto", display: "block" }} />
            </div>
          </motion.button>
        </div>

        <p style={{ textAlign: "center", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.76rem", color: "rgba(26,58,92,0.45)", marginTop: 20 }}>
          Tap the label to read it full size.
        </p>
      </div>

      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomed(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 1000,
            background: "rgba(10,22,40,0.85)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, cursor: "zoom-out",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LABEL_SRC}
            alt="Elegancià ingredient and mineral content label"
            style={{ maxWidth: "100%", maxHeight: "90vh", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
          />
        </div>
      )}
    </div>
  );
}
