
import { Button } from "@/components/ui/button";

const CTASection = ({ className = "" }) => {
  return (
    <section className={`py-16 ${className} text-white`}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Transform Your Daily Routine Today
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of men who've elevated their skincare routine with Manscara. Clearer, healthier skin is just a click away.
          </p>
          <Button className="btn-primary text-lg px-8 py-3 bg-white text-manscara-black hover:bg-gray-100">
            Get Started Now
          </Button>
          <p className="mt-6 text-sm text-gray-400">
            30-day money back guarantee. Free shipping on all orders.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
