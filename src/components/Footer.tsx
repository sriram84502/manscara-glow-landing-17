
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-manscara-black text-white py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-1 lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src="/lovable-uploads/619af646-e154-42b0-91d9-8b80937da07b.png" 
                alt="Manscara Logo" 
                className="h-10 w-auto invert"
              />
              <span className="ml-3 font-serif text-2xl font-semibold">Manscara</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium skincare products designed specifically for men. Looking good has never been this simple.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
              <li><a href="#benefits" className="text-gray-400 hover:text-white transition-colors text-sm">Benefits</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm">Testimonials</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Information</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Ingredients</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Subscribe to get special offers, free giveaways, and product launches.
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Your email" 
                aria-label="Email address"
                className="px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder:text-gray-500"
              />
              <button 
                type="submit" 
                className="px-4 py-3 bg-white text-manscara-black rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Manscara. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-gray-400 text-sm">
            Made with care for men's skincare
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
