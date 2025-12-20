import { Link } from "react-router-dom";
import {
  Pencil,
  Heart,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#1E293B] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <span className="font-sketch text-2xl font-bold text-white">
                SketchNote
              </span>
            </Link>
            <p className="font-body text-gray-400 max-w-sm mb-6">
              The leading sketchnote app to help you take notes and create anytime, anywhere.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Instagram className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-sketch text-xl font-medium mb-6 text-white">Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="font-body text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="font-body text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="font-body text-gray-400 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="font-body text-gray-400 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sketch text-xl font-medium mb-6 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="font-body text-gray-400">
                  hello@sketchnote.app
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-gray-500">
            © 2024 SketchNote. All rights reserved.
          </p>
          <p className="font-hand text-sm text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-primary fill-primary" />{" "}
            for creators
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
