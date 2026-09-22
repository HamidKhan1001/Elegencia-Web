"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCutout } from "./hero/cutoutCache";
import { withBasePath } from "@/lib/basePath";

const BOTTLE_SRC = withBasePath("/products/bottle-500ml-front.png");

// Same real numbers as the Mineral Profile section further down — this is
// just the quick, visual version people see first; that one is the full
// breakdown for anyone who wants it.
const INGREDIENTS = [
  { icon: "◎", label: "pH Balance", value: "7.8", pos: "chip-tl" },
  { icon: "◇", label: "TDS", value: "45 mg/L", pos: "chip-tr" },
  { icon: "✦", label: "Silica", value: "14 mg/L", pos: "chip-bl" },
  { icon: "◆", label: "Electrolytes", value: "Mg²⁺ & Ca²⁺", pos: "chip-br" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Ingredients() {
  const [bottleUrl, setBottleUrl] = useState<string | null>(null);

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
          style={{ textAlign: "center", marginBottom: 8 }}
        >
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)", marginBottom: 14, display: "inline-block" }}>
            What&apos;s Inside
          </span>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(1.6rem,3.2vw,2.6rem)", fontWeight: 700, color: "#0a1628" }}>
            Every Bottle, Broken Down
          </h2>
        </motion.div>

        <div className="ingredients-stage" style={{ position: "relative", maxWidth: 640, margin: "0 auto", height: 460 }}>
          {/* Soft glow behind the bottle, ties the callouts together visually */}
          <div aria-hidden style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: 320, height: 320, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(74,158,202,0.16), transparent 70%)",
            filter: "blur(6px)",
          }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="ingredients-bottle"
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", height: 340, zIndex: 2 }}
          >
            {bottleUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bottleUrl} alt="Elegancià Regular bottle" style={{ height: "100%", width: "auto", objectFit: "contain", filter: "drop-shadow(0 20px 30px rgba(10,22,40,0.2))" }} />
            )}
          </motion.div>

          {INGREDIENTS.map((ing, i) => (
            <motion.div
              key={ing.label}
              className={`ingredients-chip ${ing.pos}`}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.25 + i * 0.12, ease: EASE }}
              style={{ position: "absolute", zIndex: 3 }}
            >
              {/* A slow, continuous drift once it's landed — the bit that
                  makes it read as "alive" rather than a static graphic. */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  padding: "12px 16px", minWidth: 132,
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(74,158,202,0.25)", borderRadius: "10px",
                  boxShadow: "0 10px 30px rgba(10,22,40,0.1)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "1.1rem", color: "#4a9eca", marginBottom: 4 }}>{ing.icon}</div>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: "1rem", fontWeight: 700, color: "#0a1628" }}>{ing.value}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(26,58,92,0.55)", marginTop: 2 }}>{ing.label}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
