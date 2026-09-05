"use client";

import { useEffect, useState } from "react";

// Shown until the page's resources (images included) have actually
// finished loading — `window.load` only fires once every image, script,
// and stylesheet the page requested has settled, which is the honest
// signal the user asked for ("so user knows it's loading and rendering").
// A minimum display time avoids an instant flash on a fast connection, and
// a fallback timeout guarantees it never gets stuck if something hangs.
export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const minVisibleMs = 800;
    const fallbackMs = 6000;
    const shownAt = Date.now();
    let settled = false;

    const dismiss = () => {
      if (settled) return;
      settled = true;
      const wait = Math.max(0, minVisibleMs - (Date.now() - shownAt));
      window.setTimeout(() => {
        setFading(true);
        window.setTimeout(() => setVisible(false), 450);
      }, wait);
    };

    if (document.readyState === "complete") {
      dismiss();
    } else {
      window.addEventListener("load", dismiss);
    }
    const fallback = window.setTimeout(dismiss, fallbackMs);

    return () => {
      window.removeEventListener("load", dismiss);
      window.clearTimeout(fallback);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "#f0f8ff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.45s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
          letterSpacing: "0.28em",
          color: "#0a1628",
          marginBottom: "24px",
        }}
      >
        ELEGANC<span style={{ color: "#4a9eca" }}>Ì</span>A
      </div>
      <div
        style={{
          width: "140px",
          height: "2px",
          background: "rgba(74,158,202,0.16)",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            width: "50%",
            background: "linear-gradient(90deg, transparent, #4a9eca, transparent)",
            animation: "loading-sweep 1.1s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
