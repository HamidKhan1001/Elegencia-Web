import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { withBasePath } from "@/lib/basePath";

export const metadata: Metadata = {
  title: "Licenses & Certifications | Elegancià",
  description: "Elegancià's business registration and quality certifications.",
};

const ENTRIES = [
  {
    title: "Business Registration",
    body: "Elegancià is produced and bottled by Elegancià Waters (Pvt.) Ltd, registered and operating out of Hayatabad, Peshawar, Pakistan.",
  },
  {
    title: "Quality Management",
    body: "Our bottling process follows ISO 9001 quality management standards, with the water tested quarterly by an independent lab.",
  },
  {
    title: "Food Safety & Hygiene",
    body: "The facility operates under standard food safety and hygiene practices for packaged drinking water, from sourcing through to the sealed bottle.",
  },
];

export default function LicensePage() {
  return (
    <main style={{ background: "#f0f8ff", minHeight: "100vh" }}>
      <Navbar />

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "160px 32px 100px" }}>
        <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.6rem", letterSpacing: "0.32em", textTransform: "uppercase", color: "#4a9eca", fontWeight: 700, padding: "4px 14px", border: "1px solid rgba(74,158,202,0.3)", borderRadius: "20px", background: "rgba(74,158,202,0.06)", marginBottom: 20, display: "inline-block" }}>
          Legal
        </span>

        <h1 style={{ fontFamily: "'Cinzel',serif", fontSize: "clamp(2rem,4vw,2.8rem)", fontWeight: 700, color: "#0a1628", marginBottom: 24, lineHeight: 1.15 }}>
          Licenses & Certifications
        </h1>

        <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1rem", lineHeight: 1.8, color: "rgba(26,58,92,0.75)", marginBottom: 48, maxWidth: 620 }}>
          A short summary of how Elegancià is registered and what standards our bottling process is held to. Certificate copies are available on request.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {ENTRIES.map((e) => (
            <div key={e.title} style={{ padding: "24px 26px", background: "rgba(255,255,255,0.97)", border: "1px solid rgba(74,158,202,0.2)", borderRadius: "8px", boxShadow: "0 2px 20px rgba(74,158,202,0.08)" }}>
              <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: "1.05rem", fontWeight: 700, color: "#0a1628", marginBottom: 8 }}>{e.title}</h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.9rem", lineHeight: 1.75, color: "rgba(26,58,92,0.65)" }}>{e.body}</p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.88rem", lineHeight: 1.8, color: "rgba(26,58,92,0.6)", marginTop: 40 }}>
          Questions about a specific certificate or registration number? <a href={`${withBasePath("/")}#contact`} style={{ color: "#4a9eca", fontWeight: 600 }}>Get in touch</a> and we&apos;ll send it over.
        </p>
      </div>

      <Footer />
    </main>
  );
}
