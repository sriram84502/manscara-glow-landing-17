
import { Button } from "@/components/ui/button";
import { ArrowDown, ShoppingBag, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCountUp } from "@/hooks/useCountUp";

const HeroSection = () => {
  // Function to scroll to the next section
  const scrollToNextSection = () => {
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to scroll to features section for info button
  const scrollToFeaturesSection = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isMobile = useIsMobile();
  
  // CountUp hooks for statistics
  const cleanerSkinCount = useCountUp({ end: 98, suffix: '%' });
  const ingredientsCount = useCountUp({ end: 30, suffix: '+' });
  const lastingEffectCount = useCountUp({ end: 24, suffix: 'h' });

  return (
    <section className={`relative ${isMobile ? 'h-[45vh]' : 'h-[80vh] sm:h-screen'} overflow-hidden pt-10 md:pt-16`}>
      {/* Spline 3D Background using the provided embed code */}
      <div className="absolute inset-0 w-full h-full z-0">
        {/* Using dangerouslySetInnerHTML to properly render the custom element */}
        <div dangerouslySetInnerHTML={{ 
          __html: '<spline-viewer loading-anim-type="spinner-small-light" url="https://prod.spline.design/E1JnXeUPttEDoYtZ/scene.splinecode"></spline-viewer>'
        }} className="w-full h-full" />
      </div>
      
      {/* Bottom overlay to hide Spline watermark - with the specific HSL color */}
      <div className={`absolute bottom-0 left-0 w-full ${isMobile ? 'h-14' : 'h-16'} z-10`} style={{ backgroundColor: 'hsl(30deg 74.07% 89.41%)' }}></div>
      
      {/* Hero Content - Fixed to always take exactly 50% width on desktop, 50% on mobile */}
      <div className="relative z-20 container h-full flex items-center">
        <div className={`${isMobile ? 'w-1/2 pt-10' : 'w-1/2'} animate-fade-in`}>
          <div className="flex flex-col justify-center">
            <h1 className={`${isMobile ? 'text-xl' : 'text-5xl md:text-6xl lg:text-7xl'} font-bold leading-tight mb-6 animate-enter`}>
              <span className="font-serif">Manscara</span> <span className={`${isMobile ? 'block' : 'inline'} text-gray-700`}>Face Wash</span>
            </h1>
            
            {/* Description paragraph - hidden on mobile */}
            {!isMobile && (
              <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in max-w-md" style={{animationDelay: "0.2s"}}>
                Advanced formula with natural ingredients to cleanse, refresh, and rejuvenate your skin. Developed by dermatologists specifically for men's skin.
              </p>
            )}
            
            {/* Mobile: Icon buttons side by side, Desktop: Text buttons */}
            <div className={`flex gap-4 animate-fade-in ${isMobile ? 'flex-row' : 'flex-col sm:flex-row'}`} style={{animationDelay: "0.4s"}}>
              {isMobile ? (
                <>
                  <Button 
                    className="bg-manscara-black hover:bg-black text-white hover:scale-105 transition-transform duration-300 flex items-center gap-2 px-3 py-2"
                    onClick={scrollToNextSection}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-sm">Shop</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="hover:scale-105 transition-transform duration-300"
                    onClick={scrollToFeaturesSection}
                  >
                    <Info className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-manscara-black hover:bg-black text-white hover:scale-105 transition-transform duration-300"
                    onClick={scrollToNextSection}
                  >
                    Shop Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="hover:scale-105 transition-transform duration-300"
                    onClick={scrollToFeaturesSection}
                  >
                    Learn More
                  </Button>
                </>
              )}
            </div>
            
            {/* Stats section with adjusted layout for mobile (all in one row) */}
            <div className="mt-6 animate-fade-in" style={{animationDelay: "0.6s"}}>
              {isMobile ? (
                <div className="grid grid-cols-3 gap-2 max-w-xs">
                  <div ref={cleanerSkinCount.ref} className="hover:scale-105 transition-transform duration-300 text-left">
                    <p className="text-sm font-bold">{cleanerSkinCount.value}</p>
                    <p className="text-xs text-muted-foreground">Cleaner</p>
                  </div>
                  <div ref={ingredientsCount.ref} className="hover:scale-105 transition-transform duration-300 text-left">
                    <p className="text-sm font-bold">{ingredientsCount.value}</p>
                    <p className="text-xs text-muted-foreground leading-tight">
                      Ingre-<br />dients
                    </p>
                  </div>
                  <div ref={lastingEffectCount.ref} className="hover:scale-105 transition-transform duration-300 text-left">
                    <p className="text-sm font-bold">{lastingEffectCount.value}</p>
                    <p className="text-xs text-muted-foreground">Effect</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-w-sm">
                  <div ref={cleanerSkinCount.ref} className="hover:scale-105 transition-transform duration-300">
                    <p className="text-2xl md:text-3xl font-bold">{cleanerSkinCount.value}</p>
                    <p className="text-sm text-muted-foreground">Cleaner Skin</p>
                  </div>
                  <div ref={ingredientsCount.ref} className="hover:scale-105 transition-transform duration-300">
                    <p className="text-2xl md:text-3xl font-bold">{ingredientsCount.value}</p>
                    <p className="text-sm text-muted-foreground">Ingredients</p>
                  </div>
                  <div ref={lastingEffectCount.ref} className="hover:scale-105 transition-transform duration-300">
                    <p className="text-2xl md:text-3xl font-bold">{lastingEffectCount.value}</p>
                    <p className="text-sm text-muted-foreground">Effect</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Button - with pulse animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-white/20 transition-colors"
          onClick={scrollToNextSection}
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
