import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23084F8C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div
          className="rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden"
          style={{ backgroundColor: "#084F8C" }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white/20 rounded-full" />
          <div className="absolute bottom-4 right-4 w-24 h-24 border-2 border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-8 w-8 h-8 bg-white/10 rounded-lg rotate-45" />
          <div className="absolute top-1/4 right-12 w-12 h-12 bg-white/10 rounded-full" />

          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
            </div>

            <h2 className="font-sketch text-4xl md:text-5xl font-normal mb-6">
              Ready to Transform Your Notes?
            </h2>

            <p className="font-body text-xl text-white/90 max-w-2xl mx-auto mb-10">
              Join thousands of creative thinkers who have already discovered
              the power of visual note-taking with SketchNote.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 bg-white font-normal py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                style={{ color: "#084F8C" }}
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/features"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white border-2 border-white/30 font-normal py-4 px-8 rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>

            <p className="font-body text-sm text-white/70 mt-8">
              ✓ No credit card required &nbsp; ✓ Free forever plan &nbsp; ✓
              Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
