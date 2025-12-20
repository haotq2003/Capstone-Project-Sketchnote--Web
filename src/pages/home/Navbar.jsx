import { Link } from "react-router-dom";
import { Pencil, Sparkles, Menu, X, User, LogOut } from "lucide-react";
import { Button, Dropdown, Modal } from "antd";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    const roles = localStorage.getItem('roles');

    if (userInfo) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setUser(parsedUser);

        // Check if user is CUSTOMER (not ADMIN or STAFF)
        if (roles) {
          const userRoles = JSON.parse(roles);
          const isCustomer = userRoles.includes('CUSTOMER') &&
            !userRoles.includes('ADMIN') &&
            !userRoles.includes('STAFF');

          if (isCustomer) {
            setShowAccessDenied(true);
          }
        }
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('roles');
    setUser(null);
    setShowAccessDenied(false);
    window.location.href = '/';
  };

  const handleAccessDeniedOk = () => {
    handleLogout();
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div className="px-2 py-1">
          <div className="font-medium">{user?.firstName} {user?.lastName}</div>
          <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
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

          {/* CTA Button or User Info */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Button
                  type="default"
                  size="large"
                  className="bg-white text-foreground border border-border shadow-sm hover:bg-gray-50 font-medium flex items-center gap-2 h-10 rounded-xl"
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
                  className="bg-white text-foreground border border-border shadow-sm hover:bg-gray-50 font-medium flex items-center gap-2 h-10 rounded-xl"
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

              {user ? (
                <>
                  <div className="pt-2 border-t border-border">
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="font-medium">{user.firstName} {user.lastName}</div>
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
                  <Button type="primary" className="w-full mt-2 h-10 rounded-xl bg-white text-foreground border border-border shadow-sm">
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
            <span className="text-lg font-semibold">Access Restricted</span>
          </div>
        }
        open={showAccessDenied}
        onOk={handleAccessDeniedOk}
        onCancel={handleAccessDeniedOk}
        okText="Logout"
        cancelButtonProps={{ style: { display: 'none' } }}
        closable={false}
        maskClosable={false}
      >
        <div className="py-4">
          <p className="text-base mb-4">
            <strong>Hello {user?.firstName}!</strong>
          </p>
          <p className="text-base mb-4">
            This web platform is exclusively for <strong>Admin</strong> and <strong>Staff</strong> members only.
          </p>
          <p className="text-base mb-4">
            As a <strong>Customer</strong>, please use our <strong>Mobile App</strong> to access all features and services.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <p className="text-sm text-blue-800 mb-2">
              📱 <strong>Download our Mobile App:</strong>
            </p>
            <a
              href="https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk"
              className="text-blue-600 hover:text-blue-800 underline text-sm"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = 'https://expo.dev/artifacts/eas/qKdsbo1ysamCsX3JP97kCi.apk';
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
