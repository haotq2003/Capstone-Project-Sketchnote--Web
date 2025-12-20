import iconPencil from "../../assets/icon-pencil.png";
import iconNotebook from "../../assets/icon-notebook.png";
import iconLightbulb from "../../assets/icon-lightbulb.png";
import { Palette, Share2, Layers } from "lucide-react";

const features = [
  {
    icon: iconPencil,
    title: "Free Drawing",
    description:
      "Various pens and brushes for all your creative styles.",
    color: "bg-blue-50 border-blue-100",
  },
  {
    icon: iconNotebook,
    title: "Smart Notes",
    description: "Combine text, drawings, and stickers to create vivid notes.",
    color: "bg-sky-50 border-sky-100",
  },
  {
    icon: iconLightbulb,
    title: "Creative Templates",
    description: "Hundreds of available templates to help you start quickly.",
    color: "bg-amber-50 border-amber-100",
  },
];

const moreFeatures = [
  {
    icon: <Palette className="w-8 h-8 text-primary" />,
    title: "Rich Colors",
    description: "Diverse color palette with unlimited customization.",
  },
  {
    icon: <Share2 className="w-8 h-8 text-secondary" />,
    title: "Easy Sharing",
    description: "Export and share your sketchnotes anytime, anywhere.",
  },
  {
    icon: <Layers className="w-8 h-8 text-accent" />,
    title: "Pro Layers",
    description: "Manage layers like a real designer.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block font-hand text-xl text-primary mb-4 font-medium">
            ⭐ Highlight Features
          </span>
          <h2 className="font-sketch text-4xl md:text-5xl font-medium text-foreground mb-4">
            Everything you need to
            <br />
            <span className="text-primary sketch-underline">create</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto text-lg">
            Full set of tools to help you go from idea to product easily
          </p>
        </div>

        {/* Main Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group p-8 rounded-[2rem] border ${feature.color} shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-2 animate-fade-up`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-20 h-20 mb-6 animate-float-slow mx-auto">
                <img
                  src={feature.icon}
                  alt={feature.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="font-sketch text-2xl font-medium text-foreground mb-3 text-center">
                {feature.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* More Features */}
        <div className="grid md:grid-cols-3 gap-6">
          {moreFeatures.map((feature, index) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-border hover:shadow-md transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${0.6 + index * 0.15}s` }}
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-sketch text-xl font-medium text-foreground mb-1">
                  {feature.title}
                </h4>
                <p className="font-body text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
