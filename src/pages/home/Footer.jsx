import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      { name: "Features", href: "/features" },
      { name: "Gallery", href: "/gallery" },
      { name: "Pricing", href: "/pricing" },
      { name: "Download", href: "/download" },
    ],
    Company: [
      { name: "About Us", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    Support: [
      { name: "Help Center", href: "/help" },
      { name: "Community", href: "/community" },
      { name: "Tutorials", href: "/tutorials" },
      { name: "API Docs", href: "/docs" },
    ],
    Legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  ];

  return (
    <footer className="bg-foreground text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Logo" className="w-10 h-10" />
              <span className="font-sketch text-2xl font-normal text-white">
                SketchNote
              </span>
            </Link>

            <p className="font-body text-gray-400 mb-6 leading-relaxed">
              Transform your ideas into beautiful visual notes. SketchNote makes
              it easy to capture, organize, and share your thoughts creatively.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 transition-all duration-300 hover:text-white"
                  style={{ backgroundColor: "rgba(8, 79, 140, 0.3)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#084F8C")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(8, 79, 140, 0.3)")
                  }
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sketch text-lg font-normal mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="font-body text-gray-400 transition-colors"
                      onMouseEnter={(e) => (e.target.style.color = "#5B9BD5")}
                      onMouseLeave={(e) => (e.target.style.color = "")}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-gray-400 text-sm">
              © {currentYear} SketchNote. All rights reserved.
            </p>

            <p className="font-body text-gray-400 text-sm flex items-center gap-1">
              Made with{" "}
              <Heart
                className="w-4 h-4 fill-current"
                style={{ color: "#084F8C" }}
              />{" "}
              by the SketchNote Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
