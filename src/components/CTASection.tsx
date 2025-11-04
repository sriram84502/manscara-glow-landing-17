
import { Button } from "@/components/ui/button";

const CTASection = ({ className = "" }) => {
  return (
    <section className={`section-padding ${className} text-white`}>
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Transform Your Daily Routine Today
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
            Join thousands of men who've elevated their skincare routine with Manscara. Clearer, healthier skin is just a click away.
          </p>
          <Button size="lg" className="text-lg px-10 py-6 h-auto bg-white text-manscara-black hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all">
            Get Started Now
          </Button>
          <p className="mt-8 text-base text-white/70">
            30-day money back guarantee • Free shipping on all orders
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
