import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../utils/formatters";
import Button from "../common/Button";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  /**
   * Checks if a path is active
   */
  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `
    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300
    ${
      isActive(path)
        ? "text-cyan-400 bg-cyan-500/10"
        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
    }
  `
      .trim()
      .replace(/\s+/g, " ");

  return (
    <nav className="bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and primary nav */}
          <div className="flex items-center">
            <Link
              to={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center group"
            >
              <span className="text-3xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                coEdit
              </span>
            </Link>

            {/* Desktop navigation */}
            {isAuthenticated && (
              <div className="hidden md:flex md:ml-10 md:space-x-2">
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/shared" className={navLinkClass("/shared")}>
                  Shared with Me
                </Link>
              </div>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-zinc-800 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-lg shadow-cyan-500/20">
                      {getInitials(user?.name || user?.email || "U")}
                    </div>
                    <span className="hidden md:block text-sm text-zinc-300">
                      {user?.name || user?.email}
                    </span>
                    <svg
                      className={`w-4 h-4 text-zinc-500 transition-transform ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 z-20 overflow-hidden">
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="block px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            Profile Settings
                          </Link>
                          <hr className="my-1 border-zinc-800" />
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-zinc-800 hover:text-red-300 transition-colors"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex md:items-center md:gap-3">
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Get Started</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800">
          <div className="px-3 pt-2 pb-3 space-y-1 bg-zinc-900/50">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`block ${navLinkClass("/dashboard")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/shared"
                  className={`block ${navLinkClass("/shared")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Shared with Me
                </Link>
                <Link
                  to="/profile"
                  className={`block ${navLinkClass("/profile")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`block ${navLinkClass("/login")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={`block ${navLinkClass("/register")}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
