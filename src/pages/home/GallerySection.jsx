import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

const screenshots = [
  {
    id: 1,
    title: "Main Canvas",
    description: "Clean and intuitive workspace",
  },
  {
    id: 2,
    title: "Tool Palette",
    description: "Full set of brushes and drawing tools",
  },
  {
    id: 3,
    title: "Template Library",
    description: "Hundreds of beautiful templates",
  },
  {
    id: 4,
    title: "Export & Share",
    description: "Share your work easily",
  },
];

const GallerySection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (prev) => (prev - 1 + screenshots.length) % screenshots.length
    );
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block font-hand text-lg text-primary mb-4 font-medium">
            📱 App Preview
          </span>
          <h2 className="font-sketch text-4xl md:text-5xl font-medium text-foreground mb-4">
            Beautiful <span className="text-primary">Interface</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Exquisite design experience, optimized for every interaction
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.id}
              className={`group relative overflow-hidden rounded-3xl border-2 border-border bg-card shadow-soft hover:shadow-hover transition-all duration-500 hover:-translate-y-2 cursor-pointer animate-fade-up ${activeIndex === index ? "ring-4 ring-primary ring-offset-4" : ""
                }`}
              style={{ animationDelay: `${index * 0.15}s` }}
              onClick={() => setActiveIndex(index)}
            >
              {/* Placeholder for app screenshot */}
              <div className="aspect-[9/16] bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <span className="font-sketch text-3xl">📱</span>
                  </div>
                  <p className="font-hand text-muted-foreground text-sm">
                    Add screenshot #{screenshot.id}
                  </p>
                  <p className="font-body text-xs text-muted-foreground/70 mt-1">
                    (Size: 1080x1920)
                  </p>
                </div>
              </div>

              {/* Overlay Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/90 to-transparent">
                <h4 className="font-sketch text-lg font-medium text-background">
                  {screenshot.title}
                </h4>
                <p className="font-body text-sm text-background/80">
                  {screenshot.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prevSlide}
            className="rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="flex gap-2">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index
                  ? "bg-primary w-8"
                  : "bg-muted hover:bg-muted-foreground/30"
                  }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={nextSlide}
            className="rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
