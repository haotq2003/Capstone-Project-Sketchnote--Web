import { Button } from "./Button";
import { ArrowRight, Download } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="relative bg-gradient-to-br from-blue-50 to-white rounded-[3rem] border border-blue-100 shadow-lg p-12 md:p-16 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100/50 rounded-full blur-2xl" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-blue-100 mb-8 shadow-sm">
              <Download className="w-4 h-4 text-primary" />
              <span className="font-body text-sm text-primary font-medium">
                Free Download
              </span>
            </span>

            <h2 className="font-sketch text-4xl md:text-6xl font-medium text-foreground mb-6">
              Ready to
              <br />
              <span className="text-primary sketch-underline">
                create?
              </span>
            </h2>

            <p className="font-body text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Join over 50,000 users creating amazing sketchnotes every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="hero"
                size="xl"
                onClick={() => window.location.href = 'https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk'}
              >
                <Download className="w-5 h-5" />
                Download App
              </Button>
              <Button variant="outline" size="xl" className="bg-white hover:bg-gray-50">
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* App Store Badges */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <div className="px-6 py-3 bg-[#1E293B] rounded-xl flex items-center gap-3 shadow-lg hover:-translate-y-1 transition-transform cursor-pointer">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <p className="text-[10px] text-white/70 font-body uppercase tracking-wider">
                    Download on
                  </p>
                  <p className="text-sm font-bold text-white font-body">
                    App Store
                  </p>
                </div>
              </div>
              <div className="px-6 py-3 bg-[#1E293B] rounded-xl flex items-center gap-3 shadow-lg hover:-translate-y-1 transition-transform cursor-pointer">
                <span className="text-2xl">▶️</span>
                <div className="text-left">
                  <p className="text-[10px] text-white/70 font-body uppercase tracking-wider">
                    Download on
                  </p>
                  <p className="text-sm font-bold text-white font-body">
                    Google Play
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
