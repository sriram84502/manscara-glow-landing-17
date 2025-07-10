
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-manscara-black text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1 lg:col-span-1">
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/619af646-e154-42b0-91d9-8b80937da07b.png" 
                alt="Manscara Logo" 
                className="h-10 w-auto invert"
              />
              <span className="ml-2 font-serif text-xl font-semibold">Manscara</span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium skincare products designed specifically for men. Looking good has never been this simple.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#benefits" className="text-gray-400 hover:text-white transition-colors">Benefits</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Information</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ingredients</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and product launches.
            </p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 bg-gray-800 text-white rounded-l-md border-0 flex-grow focus:outline-none focus:ring-1 focus:ring-manscara-blue"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-white text-manscara-black rounded-r-md font-medium hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Manscara. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <img src="https://via.placeholder.com/200x30?text=Payment+Methods" alt="Payment Methods" className="h-6" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
