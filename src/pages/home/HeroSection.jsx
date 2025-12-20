import { Button } from "./Button";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImage from "../../assets/hero-sketch.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-background">
      {/* Decorative Elements */}
      <div className="absolute top-32 left-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl animate-float" />
      <div className="absolute top-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-float" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-primary/20 shadow-sm mb-6 animate-fade-up">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="font-body text-sm text-muted-foreground font-medium">
                #1 Visual Note Taking App
              </span>
            </div>

            <h1 className="font-sketch text-5xl md:text-7xl font-medium text-foreground leading-tight mb-6 animate-fade-up animation-delay-200">
              Turn ideas into
              <span className="text-primary sketch-underline ml-3">Sketchnote</span>
              <br />
              beautifully
            </h1>

            <p className="font-body text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8 animate-fade-up animation-delay-400">
              Note-taking, illustration, and unlimited creativity. Simple yet powerful sketchnote tool for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up animation-delay-600">
              <Button
                variant="hero"
                size="xl"
                onClick={() => window.location.href = 'https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk'}
              >
                Download App
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="xl">
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-12 animate-fade-up animation-delay-800">
              <div className="text-center">
                <p className="font-sketch text-3xl font-medium text-foreground">
                  50K+
                </p>
                <p className="font-hand text-muted-foreground text-lg">Users</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-sketch text-3xl font-medium text-foreground">
                  4.9★
                </p>
                <p className="font-hand text-muted-foreground text-lg">Rating</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="font-sketch text-3xl font-medium text-foreground">
                  100+
                </p>
                <p className="font-hand text-muted-foreground text-lg">Templates</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative animate-scale-in animation-delay-400">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="SketchNote Hero Illustration"
                className="w-full max-w-2xl mx-auto rounded-3xl shadow-hover animate-float-slow"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary rounded-2xl shadow-sketch animate-wiggle flex items-center justify-center">
              <span className="font-sketch text-2xl">✏️</span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary rounded-2xl shadow-sketch animate-float flex items-center justify-center">
              <span className="font-sketch text-3xl">💡</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
