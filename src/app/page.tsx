import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";
import HeroReveal from "@/components/HeroReveal";
import HeroScroll from "@/components/HeroScroll";
import BrandStory from "@/components/BrandStory";
import CeoMessage from "@/components/CeoMessage";
import MineralProfile from "@/components/MineralProfile";
import Sustainability from "@/components/Sustainability";
import ProductShowcase from "@/components/ProductShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main style={{ background: "#f0f8ff" }}>
      <LoadingScreen />
      <Navbar />

      {/* Hero: center-anchored bottle with a smoky/atmospheric reveal between products */}
      <HeroReveal />

      {/* About Us: cinematic frame-sequence reveal, telling the brand's story */}
      <HeroScroll />

      {/* Sections stack naturally after the hero scroll tracks */}
      <BrandStory />
      <CeoMessage />
      <MineralProfile />
      <Sustainability />
      <ProductShowcase />
      <Footer />
    </main>
  );
}
