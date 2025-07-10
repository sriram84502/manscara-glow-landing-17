
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductCatalog from "@/components/ProductCatalog";
import FeaturesSection from "@/components/FeaturesSection";
import BenefitsSection from "@/components/BenefitsSection";
import ReviewsSection from "@/components/ReviewsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const Index = () => {
  return (
    <div className="min-h-screen bg-manscara-offwhite overflow-x-hidden">
      <Helmet>
        <title>Manscara - Premium Face Wash for Men</title>
        <meta name="description" content="Discover Manscara's premium face wash designed specifically for men. Cleanse, refresh, and rejuvenate your skin with our exclusive formula." />
        <meta name="keywords" content="men face wash, manscara, premium skincare, men skincare, face cleansing" />
        <link rel="canonical" href="https://manscara.com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Manscara - Premium Face Wash for Men" />
        <meta property="og:description" content="Premium skincare products designed specifically for men. Looking good has never been this simple." />
        <meta property="og:url" content="https://manscara.com" />
        <script type="module" src="https://unpkg.com/@splinetool/viewer@1.9.91/build/spline-viewer.js"></script>
      </Helmet>

      <Navbar />
      <main>
        <HeroSection />
        
        <ScrollReveal animation="fade-up" className="section-padding" id="catalog-section">
          <ProductCatalog className="bg-white" />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-right" className="section-padding" id="features-section" delay={200}>
          <FeaturesSection className="bg-manscara-offwhite" />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-left" className="section-padding" id="benefits-section" delay={300}>
          <BenefitsSection className="bg-manscara-beige" />
        </ScrollReveal>
        
        <ScrollReveal animation="fade-up" className="section-padding" id="testimonials-section" delay={400}>
          <ReviewsSection className="bg-white" />
        </ScrollReveal>
        
        <ScrollReveal animation="scale-up" className="section-padding" delay={500}>
          <CTASection className="bg-manscara-black" />
        </ScrollReveal>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
