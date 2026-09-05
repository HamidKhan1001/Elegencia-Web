"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { withBasePath } from "@/lib/basePath";

const TOTAL_FRAMES = 100;

const slides = [
  {
    eyebrow: "Est. Above the Arctic Circle · About Us",
    heading: "Elegancìa.\nA Promise,\nNot Just a Bottle.",
    sub: "Founded by a small team obsessed with one idea: water should be as pure as the place it comes from.",
  },
  {
    eyebrow: "Who We Are",
    heading: "Guardians of\nthe Glacier,\nNot Just Bottlers.",
    sub: "We don't own the source — we protect it. Every liter we take, we account for.",
  },
  {
    eyebrow: "Our Promise to You",
    heading: "Elegancìa —\nCrafted for\nGenerations.",
    sub: "The same water our founders tasted a decade ago, unchanged, uncompromised.",
  },
];

// Fixed, hand-picked values instead of Math.random() — a random value
// evaluated at module scope differs between the server render and the
// client's first render, which is a React hydration mismatch on every load.
const snowflakes = [
  { id: 0,  left: 2,  delay: 0.8, duration: 13.5, size: 2.4 },
  { id: 1,  left: 9,  delay: 4.6, duration: 16.2, size: 1.8 },
  { id: 2,  left: 15, delay: 2.1, duration: 11.4, size: 3.0 },
  { id: 3,  left: 21, delay: 7.3, duration: 14.8, size: 2.0 },
  { id: 4,  left: 27, delay: 1.4, duration: 17.6, size: 2.6 },
  { id: 5,  left: 33, delay: 5.9, duration: 12.3, size: 1.6 },
  { id: 6,  left: 6,  delay: 9.2, duration: 15.5, size: 2.8 },
  { id: 7,  left: 39, delay: 3.5, duration: 13.1, size: 2.2 },
  { id: 8,  left: 12, delay: 6.7, duration: 18.4, size: 1.9 },
  { id: 9,  left: 44, delay: 0.2, duration: 11.9, size: 2.5 },
  { id: 10, left: 18, delay: 8.1, duration: 16.9, size: 2.1 },
  { id: 11, left: 30, delay: 4.0, duration: 14.2, size: 1.7 },
];

const MOBILE_QUERY = "(max-width: 1080px)";

export default function HeroScroll() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const stickyRef      = useRef<HTMLDivElement>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const framesRef      = useRef<HTMLImageElement[]>([]);
  const frameIdxRef    = useRef(0);       // integer frame index, updated in rAF
  const progressRef    = useRef(0);       // raw scroll progress, no React state lag
  const rafScrollRef   = useRef<number | null>(null);

  const [progress, setProgress] = useState(0);  // drives text/UI only
  const [loaded, setLoaded]     = useState(false);

  // ---------- draw ----------
  // Desktop only — the frame sequence is never loaded on mobile at all (see
  // the preload effect below), so frames[idx] is always empty there and
  // this returns before reaching any drawing code.
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames[idx]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = frames[idx];
    const cw = canvas.width, ch = canvas.height;
    const iw = img.naturalWidth  || 700;
    const ih = img.naturalHeight || 394;

    ctx.fillStyle = "#f0f8ff";
    ctx.fillRect(0, 0, cw, ch);

    const scale = ch / ih;
    const dw = Math.round(iw * scale);
    const dh = ch;
    // dx sits inside the gradient's fully-opaque zone (0–22%) so the edge is invisible
    const dx = Math.round(cw * 0.21);
    const dy = Math.round(ch * 0.08);
    ctx.drawImage(img, 0, 0, iw, ih, dx, dy, dw, dh);
  }, []);

  // ---------- keep the canvas's actual pixel buffer matched to its
  // displayed size, instead of a fixed 1280×720 buffer CSS-stretched into
  // whatever box it's given (which is what was distorting/over-cropping the
  // bottle on narrow phone widths) ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !sticky) return;
    const resize = () => {
      const rect = sticky.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        drawFrame(frameIdxRef.current);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [drawFrame]);

  // ---------- preload ----------
  // Skipped entirely on mobile — the frame-sequence bottle animation is
  // desktop-only, so there's no reason to spend 100 image requests loading
  // it on a mobile connection just to never show it.
  useEffect(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) return;
    let done = 0;
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const idx = i - 1;
      img.onload = () => {
        imgs[idx] = img;
        done++;
        if (done === TOTAL_FRAMES) {
          framesRef.current = imgs;
          setLoaded(true);
          drawFrame(0);
        }
      };
      img.src = withBasePath(`/frames/f${String(i).padStart(3, "0")}.jpg`);
    }
  }, [drawFrame]);

  // ---------- scroll → canvas (fast, no React overhead) ----------
  useEffect(() => {
    const onScroll = () => {
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
      rafScrollRef.current = requestAnimationFrame(() => {
        rafScrollRef.current = null;
        if (!containerRef.current) return;

        const rect   = containerRef.current.getBoundingClientRect();
        const trackH = containerRef.current.offsetHeight - window.innerHeight;
        const p      = Math.max(0, Math.min(1, -rect.top / trackH));

        // Canvas: direct frame mapping, no lerp — Apple-style 1:1 scrub
        const target = Math.max(0, Math.min(TOTAL_FRAMES - 1,
          Math.round(p * (TOTAL_FRAMES - 1))));
        if (target !== frameIdxRef.current) {
          frameIdxRef.current = target;
          drawFrame(target);
        }

        progressRef.current = p;
        setProgress(p);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafScrollRef.current) cancelAnimationFrame(rafScrollRef.current);
    };
  }, [drawFrame]);

  // ---------- slide transforms ----------
  const slideTransform = (i: number) => {
    const relP = (progress - i / 3) * 3; // 0→1 = this slide's active window
    const y = (0.5 - relP) * 48;         // gentle ±24px drift

    // Tight crossfade: fade in over first 15%, hold, fade out over last 15%
    let opacity: number;
    if      (relP < -0.15) opacity = 0;
    else if (relP <  0)    opacity = (relP + 0.15) / 0.15;
    else if (relP <  0.85) opacity = 1;
    else if (relP <  1.0)  opacity = Math.max(0, (1.0 - relP) / 0.15);
    else                   opacity = 0;

    return { y, opacity };
  };

  return (
    <div id="about" ref={containerRef} style={{ height: "400vh", position: "relative" }}>

      <div ref={stickyRef} className="frame-sticky" style={{
        position: "sticky", top: 0,
        height: "100vh", width: "100%",
        overflow: "hidden",
        background: "#f0f8ff",
        zIndex: 1,
      }}>

        {/* Bottle frame-sequence animation — desktop only. Hidden outright
            on mobile (see .frame-photo-layer media query) rather than just
            not drawing to it, and the frames are never even fetched there
            (see the preload effect above). */}
        <div className="frame-photo-layer">
          {/* ── CANVAS: buffer tracks its real display size, so it never gets
              stretched into the wrong aspect ratio on a narrow screen ── */}
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.6s ease",
              zIndex: 1,
              imageRendering: "auto",
            }}
          />

          {/* Left white fade — text readable, bottle emerges on the right. */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            background: "linear-gradient(to right, rgba(240,248,255,1) 0%, rgba(240,248,255,1) 22%, rgba(240,248,255,0.82) 36%, rgba(240,248,255,0.18) 52%, transparent 65%)",
          }} />
          {/* Top + bottom vignette */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
            background: "linear-gradient(to bottom, rgba(240,248,255,1) 0%, rgba(240,248,255,1) 10%, rgba(240,248,255,0.15) 22%, transparent 34%, transparent 82%, rgba(240,248,255,0.45) 100%)",
          }} />
        </div>

        {/* Snowflakes — left side only */}
        {snowflakes.map((sf) => (
          <div key={sf.id} style={{
            position: "absolute",
            left: `${sf.left}%`, top: "-24px",
            width: `${sf.size}px`, height: `${sf.size}px`,
            borderRadius: "50%",
            background: "rgba(74,158,202,0.45)",
            animation: `snow-drift ${sf.duration}s ${sf.delay}s linear infinite`,
            pointerEvents: "none", zIndex: 3,
          }} />
        ))}

        {/* ── TEXT PANEL ── */}
        <div className="frame-hero-text" style={{
          position: "absolute", top: 0, left: 0,
          width: "52%", height: "100%",
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "0 clamp(24px, 6.5vw, 96px)",
          zIndex: 5, overflow: "hidden",
        }}>
          {/* Slide dots */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "28px" }}>
            {slides.map((_, i) => {
              const relP  = (progress - i / 3) * 3;
              const active = relP >= 0 && relP < 1;
              return (
                <div key={i} style={{
                  width: active ? "26px" : "7px", height: "1.5px",
                  background: active ? "#4a9eca" : "rgba(74,158,202,0.28)",
                  borderRadius: "2px",
                  transition: "width 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s",
                }} />
              );
            })}
          </div>

          {/* Slides — absolutely stacked, physically scroll-driven */}
          <div style={{ position: "relative", height: "340px", overflow: "hidden" }}>
            {slides.map((slide, i) => {
              const { y, opacity } = slideTransform(i);
              return (
                <div key={i} style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  transform: `translateY(${y}px)`,
                  opacity,
                  willChange: "transform, opacity",
                  pointerEvents: opacity > 0.4 ? "auto" : "none",
                }}>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(0.5rem,0.76vw,0.64rem)",
                    letterSpacing: "0.3em", textTransform: "uppercase",
                    color: "#4a9eca", marginBottom: "15px", fontWeight: 700,
                  }}>{slide.eyebrow}</p>

                  <h1 style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: "clamp(2.2rem,5vw,4.4rem)",
                    fontWeight: 700, lineHeight: 1.06,
                    whiteSpace: "pre-line", color: "#0a1628",
                    marginBottom: "18px",
                  }}>{slide.heading}</h1>

                  <div style={{ width: "36px", height: "1px", background: "linear-gradient(to right, #4a9eca, transparent)", marginBottom: "16px" }} />

                  <p style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(0.82rem,1.05vw,0.92rem)",
                    lineHeight: 1.8, color: "rgba(26,58,92,0.7)",
                    maxWidth: "300px",
                  }}>{slide.sub}</p>
                </div>
              );
            })}
          </div>

          {/* Scroll hint */}
          <div style={{
            position: "absolute", bottom: "5.5vh", left: "clamp(36px,6.5vw,96px)",
            display: "flex", alignItems: "center", gap: "12px",
            opacity: Math.max(0, 1 - progress * 12),
            pointerEvents: "none",
          }}>
            <div style={{
              width: "20px", height: "34px",
              border: "1.5px solid rgba(74,158,202,0.45)",
              borderRadius: "10px",
              display: "flex", justifyContent: "center", paddingTop: "5px",
            }}>
              <div style={{
                width: "3px", height: "6px",
                background: "#4a9eca", borderRadius: "2px",
                animation: "scrollDot 1.6s ease-in-out infinite",
              }} />
            </div>
            <span style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: "0.54rem", letterSpacing: "0.26em",
              textTransform: "uppercase", color: "rgba(26,58,92,0.42)",
            }}>Scroll to explore</span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "2px", background: "rgba(74,158,202,0.1)", zIndex: 10,
        }}>
          <div style={{
            height: "100%",
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, #4a9eca, #87ceeb)",
            boxShadow: "0 0 8px rgba(74,158,202,0.6)",
          }} />
        </div>
      </div>
    </div>
  );
}
