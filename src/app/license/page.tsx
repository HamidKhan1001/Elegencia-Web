import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CertificateGrid from "@/components/CertificateGrid";
import { CERTIFICATES } from "@/lib/certificates";
import { withBasePath } from "@/lib/basePath";

export const metadata: Metadata = {
  title: "Licenses & Certifications | Elegancià",
  description: "Elegancià's business registration and quality certifications.",
};

export default function LicensePage() {
  return (
    <main style={{ background: "#f0f8ff", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "160px 32px 100px" }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)", marginBottom: 20, display: "inline-block" }}>
          Legal
        </span>

        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, color: "#0a1628", marginBottom: 24, lineHeight: 1.15 }}>
          Licenses & Certifications
        </h1>

        <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(26,58,92,0.75)", marginBottom: 40, maxWidth: 620 }}>
          Elegancià is bottled by Elegancià Water Plant, Plot No. 84-A, Industrial Estate, Hayatabad, Peshawar. These are the certificates that let us operate and use the Pakistan Standard mark. Click any of them to read the full document.
        </p>

        <CertificateGrid certificates={CERTIFICATES} />

        <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.88rem", lineHeight: 1.8, color: "rgba(26,58,92,0.6)", marginTop: 40 }}>
          Questions about any of these? <a href={`${withBasePath("/")}#contact`} style={{ color: "#4a9eca", fontWeight: 600 }}>Get in touch</a>.
        </p>
      </div>

      <Footer />
    </main>
  );
}
