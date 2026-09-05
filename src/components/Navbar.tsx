"use client";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [overHero, setOverHero] = useState(true);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40);
      const hero = document.getElementById("hero-reveal");
      // The hero is a tall sticky-pinned track — it's still covering the
      // screen for as long as its bottom edge hasn't scrolled past the
      // viewport, however far down that track actually is.
      setOverHero(hero ? hero.getBoundingClientRect().bottom > window.innerHeight : false);
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = ["Source", "Purity", "Mineral Profile", "Order"];

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      transition: "all 0.4s ease, opacity 0.5s ease",
      opacity: overHero ? 0 : 1,
      pointerEvents: overHero ? "none" : "auto",
      background: scrolled ? "rgba(255,255,255,0.94)" : "rgba(240,248,255,0.3)",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(74,158,202,0.18)" : "1px solid transparent",
      padding: scrolled ? "12px 0" : "20px 0",
    }}>
      <nav style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        <a href="#" style={{ fontFamily: "'Cinzel',serif", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "0.18em", color: "#0a1628", textDecoration: "none" }}>
          ELEGANCÌA
        </a>

        {/* inline display removed — Tailwind hidden/md:flex controls visibility */}
        <ul style={{ gap: "2.2rem", listStyle: "none", alignItems: "center" }} className="hidden md:flex">
          {links.map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase().replace(" ", "-")}`} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.73rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#1a3a5c", textDecoration: "none", fontWeight: 500, transition: "color 0.3s ease" }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#4a9eca")}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "#1a3a5c")}
              >{link}</a>
            </li>
          ))}
        </ul>

        {/* display removed from inline style — Tailwind flex/md:hidden handles it */}
        <button className="flex md:hidden" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: "5px" }} aria-label="menu">
          {[0, 1, 2].map((i) => <span key={i} style={{ display: "block", width: "22px", height: "1.5px", background: "#1a3a5c", transition: "all 0.3s ease", transform: menuOpen && i === 0 ? "rotate(45deg) translate(5px,5px)" : menuOpen && i === 2 ? "rotate(-45deg) translate(5px,-5px)" : menuOpen && i === 1 ? "scaleX(0)" : "none" }} />)}
        </button>
      </nav>

      {menuOpen && (
        <div style={{ background: "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", padding: "18px 32px 26px", borderTop: "1px solid rgba(74,158,202,0.12)" }}>
          {links.map((link) => (
            <a key={link} href={`#${link.toLowerCase().replace(" ", "-")}`} onClick={() => setMenuOpen(false)} style={{ display: "block", padding: "12px 0", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a3a5c", textDecoration: "none", borderBottom: "1px solid rgba(74,158,202,0.08)" }}>{link}</a>
          ))}
        </div>
      )}
    </header>
  );
}
