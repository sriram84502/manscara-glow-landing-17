
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    id: 1,
    title: "Deep Cleansing",
    description: "Removes dirt, excess oil, and impurities from your pores without stripping essential moisture.",
    icon: "🧴",
  },
  {
    id: 2,
    title: "Anti-Aging Formula",
    description: "Contains peptides that help reduce the appearance of fine lines and wrinkles.",
    icon: "✨",
  },
  {
    id: 3,
    title: "Oil Control",
    description: "Balances oil production to keep your skin matte and fresh throughout the day.",
    icon: "💧",
  },
  {
    id: 4,
    title: "Exfoliating Microbeads",
    description: "Natural microbeads gently remove dead skin cells for a smoother, brighter complexion.",
    icon: "🔄",
  },
];

const FeaturesSection = ({ className = "" }) => {
  return (
    <section id="features-section" className={`section-padding ${className}`}>
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Premium Features for Premium Men
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Manscara was developed to address the unique needs of men's skin, providing benefits that regular face washes simply can't match.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.id} className="hover-scale bg-white">
              <CardHeader>
                <span className="text-4xl mb-4">{feature.icon}</span>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
