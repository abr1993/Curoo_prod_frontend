import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useHeader } from "@/contexts/HeaderContext";

interface HeaderProps {
  title: string;
  description?: string;
  onBack?: () => void;
  titleLink?: string;
}

export const Header: React.FC<HeaderProps> = ({  onBack }) => {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
const { title, description, titleLink } = useHeader();
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const handleNav = (path: string) => {
    navigate(path, { state: { from: "nav" } });
    setMenuOpen(false);
  };

  const renderButtons = () => {
    if (!token) {
      return (
        <>
          <button
            onClick={() => handleNav("/")}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </button>
          <button
            onClick={() => handleNav("/verify/account")}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Sign In
          </button>
        </>
      );
    }

    if (role === "PATIENT") {
      return (
        <>
          <button onClick={() => handleNav("/")} className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </button>
          <button onClick={() => handleNav("/myconsults")} className="text-gray-700 hover:text-blue-600 font-medium">
            My Consults
          </button>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">
            Sign Out
          </button>
        </>
      );
    }

    if (role === "PROVIDER") {
      return (
        <>
          <button onClick={() => handleNav("/")} className="text-gray-700 hover:text-blue-600 font-medium">
            Home
          </button>
          <button onClick={() => handleNav("/provider/inbox")} className="text-gray-700 hover:text-blue-600 font-medium">
            Inbox
          </button>
          <button onClick={() => handleNav("/provider/settings")} className="text-gray-700 hover:text-blue-600 font-medium">
            Settings
          </button>
          <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-medium">
            Sign Out
          </button>
        </>
      );
    }

    return null;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Go back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
                {titleLink ? (
                  <Link to={titleLink} className="block hover:underline">
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </h1>

            {description && (
              <p className="inline-flex items-center px-3 py-1 mt-1 text-sm bg-blue-100 font-semibold text-blue-800 rounded-full">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4">{renderButtons()}</nav>

        {/* Mobile Menu */}
        <div className="md:hidden relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 flex flex-col space-y-2 border w-40">
              {renderButtons()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
