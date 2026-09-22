import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import HeroReveal from "@/components/HeroReveal";
import Ingredients from "@/components/Ingredients";
import BrandStory from "@/components/BrandStory";
import CeoMessage from "@/components/CeoMessage";
import MineralProfile from "@/components/MineralProfile";
import Sustainability from "@/components/Sustainability";
import ProductShowcase from "@/components/ProductShowcase";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main style={{ background: "#f0f8ff" }}>
      <LoadingScreen />
      <Navbar />

      {/* Hero: center-anchored bottle with a smoky/atmospheric reveal between products */}
      <HeroReveal />

      {/* What's in the bottle, right where people land after the hero */}
      <Ingredients />

      {/* Sections stack naturally after the hero scroll track */}
      <BrandStory />
      <CeoMessage />
      <MineralProfile />
      <Sustainability />
      <ProductShowcase />
      <Contact />
      <Footer />
    </main>
  );
}
