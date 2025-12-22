import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const GallerySection = () => {
  const galleryItems = [
    {
      id: 1,
      title: "Meeting Notes",
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Study Guide",
      category: "Education",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Recipe Collection",
      category: "Personal",
      image:
        "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Travel Journal",
      category: "Adventure",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Project Planning",
      category: "Business",
      image:
        "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Creative Ideas",
      category: "Art",
      image:
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop",
    },
  ];

  return (
    <section id="gallery" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block font-body text-sm font-normal tracking-wider uppercase mb-4"
            style={{ color: "#084F8C" }}
          >
            Gallery
          </span>
          <h2 className="font-sketch text-4xl md:text-5xl font-normal text-foreground mb-6">
            Get Inspired by Our{" "}
            <span style={{ color: "#084F8C" }}>Community</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore beautiful sketchnotes created by our amazing community of
            visual thinkers.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sketch hover:shadow-hover transition-all duration-300 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span
                  className="inline-block px-3 py-1 text-xs font-normal rounded-full mb-2"
                  style={{ backgroundColor: "#084F8C", color: "white" }}
                >
                  {item.category}
                </span>
                <h3 className="font-sketch text-xl font-normal text-white">
                  {item.title}
                </h3>
              </div>

              {/* Category Badge (always visible) */}
              <div className="absolute top-4 right-4">
                <span
                  className="px-3 py-1 text-xs font-normal rounded-full"
                  style={{
                    backgroundColor: "rgba(8, 79, 140, 0.9)",
                    color: "white",
                  }}
                >
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center">
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 font-body font-normal transition-colors"
            style={{ color: "#084F8C" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            View Full Gallery
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
