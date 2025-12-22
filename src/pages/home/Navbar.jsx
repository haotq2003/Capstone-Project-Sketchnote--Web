import { Link } from "react-router-dom";
import { Sparkles, Menu, X, User, LogOut } from "lucide-react";
import { Button, Dropdown, Modal } from "antd";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const roles = localStorage.getItem("roles");

    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);

        if (roles) {
          const userRoles = JSON.parse(roles);
          const isCustomer =
            userRoles.includes("CUSTOMER") &&
            !userRoles.includes("ADMIN") &&
            !userRoles.includes("STAFF");

          if (isCustomer) {
            setShowAccessDenied(true);
          }
        }
      } catch (error) {
        console.error("Error parsing user info:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("roles");
    setUser(null);
    setShowAccessDenied(false);
    window.location.href = "/";
  };

  const handleAccessDeniedOk = () => {
    handleLogout();
  };

  const userMenuItems = [
    {
      key: "profile",
      label: (
        <div className="px-2 py-1">
          <div className="font-normal">
            {user?.firstName} {user?.lastName}
          </div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <div className="flex items-center gap-2 text-red-600">
          <LogOut className="w-4 h-4" />
          Logout
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <span
              className="font-sketch text-2xl font-normal"
              style={{ color: "#084F8C" }}
            >
              SketchNote
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="font-body text-base font-normal text-foreground transition-colors hover:opacity-80"
              style={{ color: "#084F8C" }}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="font-body text-base font-normal text-muted-foreground transition-colors hover:opacity-80"
              style={{ color: "#084F8C" }}
            >
              Features
            </Link>
            <Link
              to="/gallery"
              className="font-body text-base font-normal text-muted-foreground transition-colors hover:opacity-80"
              style={{ color: "#084F8C" }}
            >
              Gallery
            </Link>
            <Link
              to="/about"
              className="font-body text-base font-normal text-muted-foreground transition-colors hover:opacity-80"
              style={{ color: "#084F8C" }}
            >
              About Us
            </Link>
          </div>

          {/* CTA Button or User Info */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="default"
                  size="large"
                  className="bg-white shadow-sm hover:bg-gray-50 font-normal flex items-center gap-2 h-10 rounded-xl"
                  style={{ borderColor: "#084F8C", color: "#084F8C" }}
                >
                  <User className="w-4 h-4" />
                  Welcome, {user.firstName}
                </Button>
              </Dropdown>
            ) : (
              <Link to="/login">
                <Button
                  type="primary"
                  size="large"
                  className="font-normal flex items-center gap-2 h-10 rounded-xl border-none"
                  style={{ backgroundColor: "#084F8C", color: "white" }}
                >
                  <Sparkles className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ color: "#084F8C" }}
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
                className="font-body text-lg font-normal transition-colors"
                style={{ color: "#084F8C" }}
              >
                Home
              </Link>
              <Link
                to="/features"
                className="font-body text-lg font-normal transition-colors"
                style={{ color: "#084F8C" }}
              >
                Features
              </Link>
              <Link
                to="/gallery"
                className="font-body text-lg font-normal transition-colors"
                style={{ color: "#084F8C" }}
              >
                Gallery
              </Link>
              <Link
                to="/about"
                className="font-body text-lg font-normal transition-colors"
                style={{ color: "#084F8C" }}
              >
                About Us
              </Link>

              {user ? (
                <>
                  <div className="pt-2 border-t border-border">
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="font-normal">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    danger
                    className="w-full mt-2 h-10 rounded-xl"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" className="w-full">
                  <Button
                    type="primary"
                    className="w-full mt-2 h-10 rounded-xl border-none"
                    style={{ backgroundColor: "#084F8C", color: "white" }}
                  >
                    <Sparkles className="w-4 h-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Access Denied Modal for Customers */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚫</span>
            <span className="text-lg font-normal">Access Restricted</span>
          </div>
        }
        open={showAccessDenied}
        onOk={handleAccessDeniedOk}
        onCancel={handleAccessDeniedOk}
        okText="Logout"
        okButtonProps={{
          style: { backgroundColor: "#084F8C", borderColor: "#084F8C" },
        }}
        cancelButtonProps={{ style: { display: "none" } }}
        closable={false}
        maskClosable={false}
      >
        <div className="py-4">
          <p className="text-base mb-4">Hello {user?.firstName}!</p>
          <p className="text-base mb-4">
            This web platform is exclusively for Admin and Staff members only.
          </p>
          <p className="text-base mb-4">
            As a Customer, please use our Mobile App to access all features and
            services.
          </p>
          <div
            className="border rounded-lg p-4 mt-4"
            style={{
              backgroundColor: "rgba(8, 79, 140, 0.1)",
              borderColor: "rgba(8, 79, 140, 0.3)",
            }}
          >
            <p className="text-sm mb-2" style={{ color: "#084F8C" }}>
              📱 Download our Mobile App:
            </p>
            <a
              href="https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk"
              className="underline text-sm"
              style={{ color: "#084F8C" }}
              onClick={(e) => {
                e.preventDefault();
                window.location.href =
                  "https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk";
              }}
            >
              Click here to download the APK
            </a>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

export default Navbar;
