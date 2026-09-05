"use client";

export default function Footer() {
  return (
    <footer style={{
      background: "linear-gradient(180deg, #e8f4fd 0%, #d0eaf8 100%)",
      borderTop: "1px solid rgba(74,158,202,0.25)",
      padding: "80px 0 40px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Top accent line */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 240, height: 1, background: "linear-gradient(90deg,transparent,rgba(74,158,202,0.6),transparent)" }} />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px" }}>

        {/* Columns */}
        <div className="footer-columns" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 52 }}>
          <div>
            <p style={{ fontFamily: "'Cinzel',serif", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "0.18em", color: "#0a1628", marginBottom: 14 }}>ELEGANCÌA</p>
            <p className="footer-blurb" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.8rem", lineHeight: 1.75, color: "rgba(26,58,92,0.55)", maxWidth: 220 }}>The water of elites. Sourced from Arctic glaciers, crafted for those who accept nothing but the finest.</p>
            <div className="footer-socials" style={{ display: "flex", gap: 12, marginTop: 22 }}>
              {["𝕏", "◎", "in"].map((icon) => (
                <button key={icon} style={{
                  width: 34, height: 34,
                  background: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(74,158,202,0.25)", borderRadius: "4px",
                  color: "rgba(26,58,92,0.5)", fontSize: "0.78rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.3s ease", fontFamily: "sans-serif",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(74,158,202,0.6)"; el.style.color = "#4a9eca"; el.style.background = "rgba(74,158,202,0.1)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(74,158,202,0.25)"; el.style.color = "rgba(26,58,92,0.5)"; el.style.background = "rgba(255,255,255,0.6)"; }}
                >{icon}</button>
              ))}
            </div>
          </div>

          {[
            { title: "Product", links: ["500ml Bottle", "6-Pack Reserve", "Luxury Case", "Gift Sets"] },
            { title: "Company", links: ["Our Story", "Sustainability", "Lab Reports", "Press"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Use", "Refund Policy", "Cookie Policy"] },
          ].map((col) => (
            <div key={col.title}>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, marginBottom: 18 }}>{col.title}</p>
              <ul style={{ listStyle: "none" }}>
                {col.links.map((link) => (
                  <li key={link} style={{ marginBottom: 11 }}>
                    <a href="#" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.78rem", color: "rgba(26,58,92,0.5)", textDecoration: "none", transition: "color 0.3s ease" }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#1a3a5c")}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(26,58,92,0.5)")}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom" style={{ borderTop: "1px solid rgba(74,158,202,0.15)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.7rem", color: "rgba(26,58,92,0.35)" }}>© 2026 Elegancìa Ltd. All rights reserved.</p>
          <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.7rem", color: "rgba(26,58,92,0.25)", letterSpacing: "0.12em" }}>Pure. Pristine. Perfection.</p>
        </div>
      </div>
    </footer>
  );
}
