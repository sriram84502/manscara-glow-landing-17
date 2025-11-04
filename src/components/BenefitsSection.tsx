const benefits = [{
  id: 1,
  title: "Clearer Skin",
  description: "Regular use leads to reduction in acne breakouts and blackheads."
}, {
  id: 2,
  title: "Smoother Texture",
  description: "Experience smoother skin texture after just 1 week of use."
}, {
  id: 3,
  title: "Reduced Irritation",
  description: "Sensitive skin formula reduces redness and irritation from shaving."
}];
const BenefitsSection = ({
  className = ""
}) => {
  return <section id="benefits" className={`section-padding ${className}`}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative max-w-md mx-auto lg:mx-0">
              <div className="relative bg-white p-6 rounded-2xl shadow-xl rotate-2 mb-6 hover-lift">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <span className="font-serif text-2xl text-gray-400">Before</span>
                </div>
              </div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl -rotate-2 hover-lift">
                <div className="aspect-square bg-gradient-to-br from-accent/30 to-accent/50 rounded-lg flex items-center justify-center">
                  <span className="font-serif text-2xl text-gray-600">After</span>
                </div>
              </div>
              <div className="absolute -bottom-4 right-8 bg-manscara-black text-white text-sm font-bold py-2 px-4 rounded-full shadow-lg">
                Real Results ✓
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Transform Your Skin in 14 Days
            </h2>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Our proprietary formula works quickly to improve your skin's appearance and health. See noticeable results after just two weeks of consistent use.
            </p>
            
            <div className="space-y-8">
              {benefits.map(benefit => <div key={benefit.id} className="flex items-start group">
                  <div className="mr-4 bg-primary text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="font-bold">{benefit.id}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default BenefitsSection;