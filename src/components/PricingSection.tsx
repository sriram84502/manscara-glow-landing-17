
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";

const pricingPlans = [{
  id: "basic",
  name: "Basic",
  price: 29.99,
  features: ["Single bottle", "Standard formula", "Free shipping", "30-day money back"],
  popular: false
}, {
  id: "premium",
  name: "Premium",
  price: 49.99,
  features: ["2 bottles (save 15%)", "Premium formula", "Free shipping", "60-day money back", "Exclusive skincare guide"],
  popular: true
}, {
  id: "ultimate",
  name: "Ultimate",
  price: 79.99,
  features: ["3 bottles (save 25%)", "Premium formula", "Free shipping", "90-day money back", "Exclusive skincare guide", "Personal consultation"],
  popular: false
}];

interface PricingSectionProps {
  className?: string;
}

const PricingSection = ({ className = "" }: PricingSectionProps) => {
  return (
    <section id="pricing" className={`section-padding ${className}`}>
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">
          Choose Your Plan
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                plan.popular ? 'border-2 border-manscara-black scale-105' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="bg-manscara-black text-white py-2 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6 md:p-8 bg-white">
                <h3 className="text-2xl font-serif font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500 ml-1">/month</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full bg-manscara-black hover:bg-gray-800">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Select Plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
