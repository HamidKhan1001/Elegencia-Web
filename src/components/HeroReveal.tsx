"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { Cutout, getCutout } from "./hero/cutoutCache";
import { withBasePath } from "@/lib/basePath";

// Sets the initial parallax transform synchronously before the browser
// paints, so there's no one-frame flash at the untransformed position.
// useLayoutEffect warns during SSR; this falls back to useEffect there.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface Product {
  src: string;
  step: string;
  titleMain: string;
  titleAccent: string;
  sub: string;
  stats: string[];
  signature: string;
  accent: string;
  heightVh: number;
}

const PRODUCTS: Product[] = [
  {
    src: withBasePath("/products/bottle-500ml-front.png"),
    step: "Alpine Origin · The Standard Bottle",
    titleMain: "Elegancià",
    titleAccent: "Standard.",
    sub: "The flagship pour — pH-balanced water, bottled at the source for everyday elevation.",
    stats: ["pH 7.8", "TDS 45mg/L", "Silica 14mg/L"],
    signature: "Naturally sourced, bottled at the source.",
    accent: "#2fa9d6",
    heightVh: 58,
  },
  {
    src: withBasePath("/products/bottle-500ml-detail.png"),
    step: "Alpine Origin · The Individual Bottle",
    titleMain: "Elegancià",
    titleAccent: "Individual.",
    sub: "The same source, the same standard — sealed at 500ml for wherever the day takes you.",
    stats: ["500ml", "Grab-and-Go", "Turquoise Seal"],
    signature: "Elegance, wherever the day takes you.",
    accent: "#3fb3dd",
    heightVh: 58,
  },
  {
    src: withBasePath("/products/bottle-19l.png"),
    step: "The 5-Gallon Dispenser",
    titleMain: "The Grand",
    titleAccent: "Dispenser.",
    sub: "For the home and office that never runs dry — the full reserve, delivered white-glove.",
    stats: ["19L", "Naturally Sourced", "White-Glove Delivery"],
    signature: "The reserve that never runs dry.",
    accent: "#1a7fbf",
    heightVh: 74,
  },
];

// One consistent backdrop for the whole hero — the bottle is what changes,
// not the room it's standing in.
const BG: [string, string] = ["#f6fbff", "#dbeefc"];
const TEXT_COLOR = "#0a1628";
const DROP_SHADOW = "drop-shadow(0 26px 34px rgba(10,22,40,0.26))";
const STAGE_X = 58; // % — bottle sits right-of-center, clear of the side caption

// Framer Motion owns the actual choreography now — a real spring/easing
// engine instead of hand-timed setTimeouts. The image genuinely turns in 3D
// (rotateY on a perspective parent) rather than just cross-fading opacity;
// text and tagline run on their own, slightly faster/slower schedules off
// the same trigger, which is what makes a multi-layer reveal feel directed
// rather than everything landing on the same beat.
const EASE = [0.22, 1, 0.36, 1] as const;
const IMAGE_DURATION = 0.9;
const TEXT_DURATION = 0.5;
const TAGLINE_DELAY = 0.55;

interface Snowflake {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

// Hand-picked, not Math.random() at module scope — that would draw a
// different pattern on the server than on the client and trigger a
// hydration mismatch. Slow and barely-there on purpose: a handful of tiny,
// faint flakes drifting down over ~20-30s each, not a blizzard.
const SNOWFLAKES: Snowflake[] = [
  { id: 0, left: 8, delay: 0, duration: 26, size: 2, opacity: 0.3 },
  { id: 1, left: 22, delay: 6, duration: 30, size: 1.5, opacity: 0.22 },
  { id: 2, left: 37, delay: 12, duration: 24, size: 2.5, opacity: 0.28 },
  { id: 3, left: 51, delay: 3, duration: 28, size: 1.5, opacity: 0.2 },
  { id: 4, left: 66, delay: 15, duration: 25, size: 2, opacity: 0.26 },
  { id: 5, left: 79, delay: 9, duration: 32, size: 1.5, opacity: 0.22 },
  { id: 6, left: 91, delay: 20, duration: 27, size: 2, opacity: 0.24 },
];

// One wheel notch or one swipe = one bottle change, in either direction.
// This must comfortably outlast IMAGE_DURATION so a second step never cuts
// into a transition still in flight — that overlap is what reads as janky
// rather than a real "one scroll = one slide" feel.
const STEP_COOLDOWN_MS = 950;

export default function HeroReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const bottleBoxRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const busyRef = useRef(false);
  const parallaxRafRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [cutouts, setCutouts] = useState<Record<string, Cutout>>({});

  // Preload every product's cutout up front — with only three photos this is
  // cheap, and it guarantees the incoming bottle is already sharp and ready
  // rather than popping in mid-transition.
  useEffect(() => {
    PRODUCTS.forEach((p) => {
      getCutout(p.src).then((c) => {
        setCutouts((prev) => ({ ...prev, [p.src]: c }));
      });
    });
  }, []);

  // A faint, responsive parallax — the bottle and the giant wordmark drift
  // oppositely with the cursor. This writes `transform` straight to the DOM
  // instead of through React state: routing it through state would
  // re-render the whole tree on every mouse move.
  useIsomorphicLayoutEffect(() => {
    const apply = (nx: number, ny: number) => {
      if (wordmarkRef.current) {
        wordmarkRef.current.style.transform = `translate(calc(-50% + ${nx * -12}px), calc(-50% + ${ny * -12}px))`;
      }
      if (bottleBoxRef.current) {
        bottleBoxRef.current.style.transform = `translate(${nx * 16}px, ${ny * 16}px)`;
      }
    };
    apply(0, 0);
    const onMove = (e: MouseEvent) => {
      if (parallaxRafRef.current) return;
      parallaxRafRef.current = requestAnimationFrame(() => {
        parallaxRafRef.current = null;
        apply(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (parallaxRafRef.current) cancelAnimationFrame(parallaxRafRef.current);
    };
  }, []);

  // Scroll-jacking: the hero is a single 100vh section, not a long scroll
  // track. While it fills the viewport, one wheel notch or swipe steps
  // exactly one product (in whichever direction) instead of scrubbing
  // continuously — preventDefault keeps the page pinned on the hero for
  // that one step, and a cooldown matching the transition length is what
  // makes it read as one deliberate slide-change rather than a scroll blur.
  // At either end (first product scrolling up, last scrolling down) nothing
  // is intercepted, so the gesture falls through to ordinary page scroll —
  // out the top, or on into the sections below.
  useEffect(() => {
    const isHeroFilling = () => {
      const el = containerRef.current;
      if (!el) return false;
      // Only ever true while nothing has scrolled the section away — once a
      // step is let through to native scroll, this naturally stops matching.
      return Math.abs(el.getBoundingClientRect().top) < 2;
    };

    const step = (goingDown: boolean) => {
      busyRef.current = true;
      activeIndexRef.current += goingDown ? 1 : -1;
      setActiveIndex(activeIndexRef.current);
      window.setTimeout(() => {
        busyRef.current = false;
      }, STEP_COOLDOWN_MS);
    };

    const onWheel = (e: WheelEvent) => {
      if (!isHeroFilling()) return;
      // Checked before the boundary test on purpose: a single fast swipe
      // fires many wheel events, and the index can already have crossed
      // into "last" partway through that burst. Deciding "let it scroll
      // away" from the post-step index would leak a few of those trailing
      // events through as real page scroll while the last slide's own
      // transition is still animating in.
      if (busyRef.current) {
        e.preventDefault();
        return;
      }
      const goingDown = e.deltaY > 0;
      const atLast = activeIndexRef.current >= PRODUCTS.length - 1;
      const atFirst = activeIndexRef.current <= 0;
      if ((goingDown && atLast) || (!goingDown && atFirst)) return;

      e.preventDefault();
      step(goingDown);
    };

    let touchStartY = 0;
    const SWIPE_PX = 30;

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isHeroFilling()) return;
      // Same ordering reason as the wheel handler: hold the page still for
      // the whole cooldown before re-checking which way is left to go.
      if (busyRef.current) {
        e.preventDefault();
        return;
      }
      const currentY = e.touches[0].clientY;
      const dy = touchStartY - currentY; // positive: finger moving up = scrolling down
      const goingDown = dy > 0;
      const atLast = activeIndexRef.current >= PRODUCTS.length - 1;
      const atFirst = activeIndexRef.current <= 0;
      if ((goingDown && atLast) || (!goingDown && atFirst)) return;

      e.preventDefault();
      if (Math.abs(dy) < SWIPE_PX) return;
      touchStartY = currentY;
      step(goingDown);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  const product = PRODUCTS[activeIndex];
  const cutout = cutouts[product.src];

  // Every bottle dimension goes through this so a single CSS custom property
  // (overridden on mobile) can shrink the whole lineup — including the 74vh
  // jug, which would otherwise clip above a raised mobile floor line.
  const bh = (vh: number) => `calc(${vh}vh * var(--bottle-scale, 1))`;
  const bhHalf = (vh: number) => `calc(${vh}vh * var(--bottle-scale, 1) / 2)`;

  // The bottle's left/top are computed directly with calc() instead of the
  // usual translate(-50%) centering trick, because that trick doesn't mix
  // safely with Framer Motion here: Framer owns its own `x`/`y` transform
  // and resolves percentages against the element's *own* box, which — on
  // top of a `left` driven by a CSS custom property that itself changes at
  // a breakpoint (--stage-x: 58% on desktop, 50% on mobile) — doesn't
  // reliably recompute when that custom property's value changes. Plain
  // calc() has no such ambiguity, so Framer is left to animate only
  // opacity/rotateY/scale, never position.
  const bottleLeft = (widthVh: number) => `calc(var(--stage-x) - ${bhHalf(widthVh)})`;
  const bottleTop = (heightVh: number) => `calc(var(--floor-vh) - ${bh(heightVh)})`;

  const statsContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.3 } },
  };
  const statItem: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
  };

  return (
    <div
      id="hero-reveal"
      ref={containerRef}
      className="hero-sticky"
      style={
        {
          position: "relative",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          background: `linear-gradient(160deg, ${BG[0]}, ${BG[1]})`,
          zIndex: 1,
          // Custom properties so the mobile breakpoint can re-center the
          // bottle with a plain CSS override, instead of juggling
          // `!important` on half a dozen individual elements.
          "--stage-x": `${STAGE_X}%`,
          "--floor-vh": "84vh",
        } as React.CSSProperties
      }
    >
        {/* ── Giant background typography — the brand mark, not the product
            name. Blurred for depth, drifts opposite the cursor. Desktop
            only (see .hero-wordmark media query): its font-size clamp
            bottoms out at 4rem, which doesn't fit a phone-width viewport
            without clipping badly at both edges — the mobile brand mark
            above exists specifically to cover the same branding purpose
            there. Static (it no longer changes with the product), so it
            needs no AnimatePresence/motion of its own. ── */}
        <div
          ref={wordmarkRef}
          className="hero-wordmark"
          aria-hidden
          style={{
            position: "absolute",
            top: "50%",
            left: "var(--stage-x)",
            transform: "translate(-50%,-50%)",
            fontFamily: "'Cinzel', serif",
            fontWeight: 900,
            fontSize: "clamp(4rem, 19vw, 17rem)",
            letterSpacing: "0.04em",
            color: TEXT_COLOR,
            opacity: 0.055,
            filter: "blur(3px)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1,
          }}
        >
          ELEGANCIÀ
        </div>

        {/* Vignette — settles focus onto the bottle, keeps the frame's edges quiet */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            pointerEvents: "none",
            background: `radial-gradient(ellipse 60% 55% at var(--stage-x) 52%, transparent 40%, rgba(10,22,40,0.10) 100%)`,
          }}
        />

        {/* Film grain — a thin layer of texture so the gradient never reads flat/digital */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            pointerEvents: "none",
            opacity: 0.05,
            mixBlendMode: "overlay",
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "140px 140px",
          }}
        />

        {/* Snow — slow, faint, easy to miss; alpine atmosphere, not a blizzard */}
        {SNOWFLAKES.map((sf) => (
          <div
            key={sf.id}
            aria-hidden
            style={{
              position: "absolute",
              left: `${sf.left}%`,
              top: "-24px",
              width: `${sf.size}px`,
              height: `${sf.size}px`,
              borderRadius: "50%",
              background: `rgba(74,158,202,${sf.opacity})`,
              animation: `snow-drift ${sf.duration}s ${sf.delay}s linear infinite`,
              pointerEvents: "none",
              zIndex: 3,
            }}
          />
        ))}

        {/* Mobile-only brand mark — the real Navbar stays hidden for the
            whole hero (by design, so it doesn't float over a full-screen
            moment), which leaves nothing identifying the brand until you
            scroll past it. This fills that gap on small screens only;
            desktop already has the giant wordmark for that. */}
        <div
          className="hero-mobile-brand"
          aria-hidden
          style={{
            position: "absolute",
            top: "2.2vh",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 6,
            fontFamily: "'Cinzel',serif",
            fontWeight: 700,
            fontSize: "1.05rem",
            letterSpacing: "0.2em",
            color: TEXT_COLOR,
          }}
        >
          ELEGANCIÀ
        </div>

        {/* ── Top chrome: step label + progress dots ── */}
        <div
          className="hero-top-chrome"
          style={{
            position: "absolute",
            top: "6vh",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            zIndex: 6,
          }}
        >
          <div style={{ position: "relative", height: "1.1em", overflow: "hidden" }}>
            <AnimatePresence mode="sync">
              <motion.p
                key={product.step}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: TEXT_DURATION, ease: EASE }}
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: "0.66rem",
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: product.accent,
                  fontWeight: 700,
                  margin: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {product.step}
              </motion.p>
            </AnimatePresence>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {PRODUCTS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === activeIndex ? "26px" : "7px",
                  height: "1.5px",
                  background: i === activeIndex ? product.accent : `${TEXT_COLOR}30`,
                  borderRadius: "2px",
                  transition: "width 0.4s cubic-bezier(0.4,0,0.2,1), background 0.4s",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Center stage: bottle, offset right of center ── */}
        <div className="hero-stage" style={{ position: "absolute", inset: 0, zIndex: 4 }}>
          <div
            ref={bottleBoxRef}
            className="hero-bottle-box"
            style={{ position: "absolute", inset: 0, perspective: "1400px" }}
          >
            {/* Ambient occlusion — a wide, soft shadow the bottle sits within.
                Fixed to one floor line so every product stands on the same
                ground, regardless of its own height. */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "var(--floor-vh)",
                left: "var(--stage-x)",
                width: "min(48vw, 320px)",
                height: "5vh",
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse closest-side, rgba(10,22,40,0.16), transparent 75%)",
                filter: "blur(10px)",
                zIndex: 0,
              }}
            />
            {/* Contact shadow — tight and dark right where the bottle actually touches down */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                top: "calc(var(--floor-vh) - 4px)",
                left: "var(--stage-x)",
                width: "min(22vw, 150px)",
                height: "1.8vh",
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse closest-side, rgba(10,22,40,0.4), transparent 80%)",
                filter: "blur(2.5px)",
                zIndex: 0,
              }}
            />

            {/* Reflection — a faint mirrored floor, cross-fading in step with the bottle */}
            <AnimatePresence mode="sync">
              {cutout && (
                <motion.div
                  key={product.src}
                  aria-hidden
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.35 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: IMAGE_DURATION, ease: EASE }}
                  style={{
                    position: "absolute",
                    top: "var(--floor-vh)",
                    left: bottleLeft(product.heightVh * cutout.aspect),
                    width: bh(product.heightVh * cutout.aspect),
                    height: bh(product.heightVh * 0.42),
                    overflow: "hidden",
                    zIndex: 0,
                    pointerEvents: "none",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 88%)",
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent 88%)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={cutout.url}
                    alt=""
                    style={{
                      position: "absolute",
                      bottom: "100%",
                      left: 0,
                      width: "100%",
                      height: bh(product.heightVh),
                      objectFit: "contain",
                      transform: "scaleY(-1)",
                      transformOrigin: "bottom",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* The bottle itself — a real 3D turn (rotateY on the perspective
                parent above), not just an opacity dissolve. */}
            <AnimatePresence mode="sync">
              {cutout && (
                <motion.img
                  key={product.src}
                  src={cutout.url}
                  alt={`${product.titleMain} ${product.titleAccent}`}
                  initial={{ opacity: 0, rotateY: 26, scale: 0.965 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -26, scale: 0.965 }}
                  transition={{ duration: IMAGE_DURATION, ease: EASE }}
                  style={{
                    position: "absolute",
                    top: bottleTop(product.heightVh),
                    left: bottleLeft(product.heightVh * cutout.aspect),
                    height: bh(product.heightVh),
                    width: bh(product.heightVh * cutout.aspect),
                    maxWidth: "80vw",
                    objectFit: "contain",
                    display: "block",
                    filter: DROP_SHADOW,
                    zIndex: 1,
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* On wide screens the caption and tagline sit either side of the
            bottle; below the breakpoint this wrapper becomes a plain
            stacked column so they never have to guess each other's height
            to avoid overlapping. */}
        <div className="hero-text-stack">
          {/* ── Side caption: sits beside the bottle, never over it ── */}
          <div className="hero-caption" style={{ zIndex: 6 }}>
            {/* No `exit` here on purpose: the old and new copy differ in
                length (a shorter product name vs. a longer one), so
                animating both at once with position:static would stack them
                on top of each other for a frame. Without `exit`, the old
                block is removed instantly and only the new one animates in —
                still reads as a clean cut, no double-height glitch. */}
            <motion.div
              key={product.step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: TEXT_DURATION, ease: EASE }}
            >
                <span
                  className="hero-eyebrow"
                  style={{
                    display: "inline-block",
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "0.68rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: product.accent,
                    fontWeight: 700,
                    marginBottom: "18px",
                  }}
                >
                  The Water of Elites
                </span>
                <h1
                  className="hero-title"
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontWeight: 700,
                    fontSize: "clamp(2.7rem, 4.4vw, 4.1rem)",
                    lineHeight: 1.03,
                    letterSpacing: "-0.01em",
                    color: TEXT_COLOR,
                    margin: "0 0 24px",
                  }}
                >
                  {product.titleMain} {product.titleAccent}
                </h1>
                <p
                  className="hero-desc"
                  style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "1.1rem",
                    lineHeight: 1.7,
                    color: `${TEXT_COLOR}c2`,
                    margin: "0 0 28px",
                    maxWidth: "420px",
                  }}
                >
                  {product.sub}
                </p>
                <motion.div
                  variants={statsContainer}
                  initial="hidden"
                  animate="show"
                  className="hero-stats-list"
                  style={{ display: "flex", flexDirection: "column", gap: "11px" }}
                >
                  {product.stats.map((stat) => (
                    <motion.div
                      key={stat}
                      variants={statItem}
                      style={{ display: "flex", alignItems: "center", gap: "12px" }}
                    >
                      <span
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: product.accent,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Plus Jakarta Sans',sans-serif",
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          letterSpacing: "0.02em",
                          color: TEXT_COLOR,
                        }}
                      >
                        {stat}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
            </motion.div>
          </div>

          {/* ── Right-side tagline — settles in a beat after the bottle does ── */}
          <div className="hero-tagline" style={{ zIndex: 6 }}>
            {/* Same reasoning as the caption above: no `exit`, so the old
                line disappears instantly instead of stacking with the new
                one while both animate. */}
            <motion.div
              key={product.signature}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: TEXT_DURATION, ease: EASE, delay: TAGLINE_DELAY }}
            >
              <p
                className="hero-tagline-text"
                style={{
                  fontFamily: "'Cinzel',serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  fontSize: "clamp(1.35rem, 2.1vw, 1.9rem)",
                  lineHeight: 1.4,
                  color: TEXT_COLOR,
                  margin: 0,
                }}
              >
                “{product.signature}”
              </p>
              <div
                style={{
                  marginTop: "16px",
                  marginLeft: "auto",
                  width: "36px",
                  height: "1px",
                  background: `linear-gradient(to left, ${product.accent}, transparent)`,
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `${product.accent}1a`,
            zIndex: 10,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(activeIndex / (PRODUCTS.length - 1)) * 100}%`,
              background: `linear-gradient(90deg, ${product.accent}, #87ceeb)`,
              boxShadow: `0 0 8px ${product.accent}99`,
              transition: "width 0.7s cubic-bezier(0.22,1,0.36,1), background 0.4s",
            }}
          />
        </div>
    </div>
  );
}
