import { Pencil, Palette, Share2, Sparkles, Zap, Cloud } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Pencil,
      title: "Natural Drawing",
      description:
        "Sketch with precision using our advanced drawing tools that feel just like pen on paper.",
    },
    {
      icon: Palette,
      title: "Rich Color Palette",
      description:
        "Express yourself with unlimited colors, gradients, and custom color schemes.",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description:
        "Share your creations instantly with friends, colleagues, or on social media.",
    },
    {
      icon: Sparkles,
      title: "Smart Templates",
      description:
        "Start quickly with beautiful templates designed for various note-taking styles.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Experience smooth, lag-free drawing with our optimized rendering engine.",
    },
    {
      icon: Cloud,
      title: "Cloud Sync",
      description:
        "Access your notes anywhere, anytime. Your sketches are always backed up safely.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block font-body text-sm font-normal tracking-wider uppercase mb-4"
            style={{ color: "#084F8C" }}
          >
            Features
          </span>
          <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground mb-6">
            Everything You Need to{" "}
            <span style={{ color: "#084F8C" }}>Create</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful tools designed to help you capture, organize, and share
            your ideas in the most creative way possible.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-8 bg-white rounded-2xl border border-border shadow-sketch hover:shadow-hover transition-all duration-300 hover:-translate-y-2"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: "rgba(8, 79, 140, 0.1)" }}
              >
                <feature.icon
                  className="w-7 h-7"
                  style={{ color: "#084F8C" }}
                />
              </div>

              <h3 className="font-sketch text-xl font-normal text-foreground mb-3">
                {feature.title}
              </h3>

              <p className="font-body text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
