import { Link } from "react-router-dom";
import { Pencil, Sparkles, Menu, X } from "lucide-react";
import { Button } from "antd";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sketch group-hover:shadow-hover transition-all duration-300 group-hover:-translate-y-1">
              <Pencil className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-sketch text-2xl font-bold text-foreground">
              SketchNote
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="font-body text-base font-medium text-foreground hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="font-body text-base font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              to="/gallery"
              className="font-body text-base font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Gallery
            </Link>
            <Link
              to="/about"
              className="font-body text-base font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              About Us
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              type="primary"
              size="large"
              className="bg-white text-foreground border border-border shadow-sm hover:bg-gray-50 font-medium flex items-center gap-2 h-10 rounded-xl"
            >
              <Sparkles className="w-4 h-4" />
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 animate-fade-up">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="font-body text-lg text-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
              <Link
                to="/features"
                className="font-body text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </Link>
              <Link
                to="/gallery"
                className="font-body text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/about"
                className="font-body text-lg text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Button type="primary" className="w-full mt-2 h-10 rounded-xl bg-white text-foreground border border-border shadow-sm">
                <Sparkles className="w-4 h-4" />
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
