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
      <div className="container my-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative">
              <div className="relative bg-white p-4 rounded-lg shadow-lg rotate-3 mb-4">
                <div className="aspect-square bg-gray-100 rounded flex items-center justify-center">
                  <span className="font-serif text-xl text-gray-400">Before</span>
                </div>
              </div>
              <div className="relative bg-white p-4 rounded-lg shadow-lg -rotate-3">
                <div className="aspect-square bg-manscara-blue bg-opacity-20 rounded flex items-center justify-center">
                  <span className="font-serif text-xl text-gray-600">After</span>
                </div>
              </div>
              <div className="absolute -bottom-6 right-4 bg-manscara-black text-white text-sm font-bold py-1 px-3 rounded-full">
                Real Results
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transform Your Skin in 14 Days
            </h2>
            <p className="text-muted-foreground mb-8">
              Our proprietary formula works quickly to improve your skin's appearance and health. See noticeable results after just two weeks of consistent use.
            </p>
            
            <div className="space-y-6">
              {benefits.map(benefit => <div key={benefit.id} className="flex">
                  <div className="mr-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm flex-shrink-0">
                    <span className="font-semibold">{benefit.id}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default BenefitsSection;