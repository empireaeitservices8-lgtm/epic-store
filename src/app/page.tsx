
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ProductSection from "@/components/ProductSection";
import PromoBanner from "@/components/PromoBanner";
import ExploreCollections from "@/components/ExploreCollections";
import CustomPrints from "@/components/CustomPrints";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <CategorySection />
        <ProductSection />
        <PromoBanner />
        <ExploreCollections />
        <CustomPrints />
        <Testimonials />
        <Newsletter />
        <Footer />
      </main>
    </>
  );
}
