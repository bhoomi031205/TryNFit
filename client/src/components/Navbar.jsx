import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sparkles,
  BookmarkPlus,
  Compass,
  Menu,
  X,
  Shirt,
  Info,
  User,
  LogOut,
  LogIn
} from 'lucide-react';
import { useWardrobe } from '../context/WardrobeContext';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ serverStatus }) => {
  const location = useLocation();
  const { savedCount } = useWardrobe();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Studio', path: '/studio' },
    { name: 'Explore Styles', path: '/explore' },
    {
      name: 'Try-On History',
      path: '/history',
      badge: savedCount > 0 ? savedCount : null,
    },
    { name: 'How It Works', path: '/how-it-works' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & AI Studio Badge */}
        <div className="flex items-center space-x-3 shrink-0">
          <Link to="/" className="flex items-center space-x-2 group">
            {/* 4-pointed pink sparkle icon */}
            <svg
              className="w-6 h-6 text-[#FF407D] transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
            <span className="font-extrabold text-2xl tracking-tight text-[#1E1B1D] font-outfit">
              TryN<span className="text-[#FF407D]">Fit</span>
            </span>
          </Link>
          
          {/* AI STUDIO Pill Badge */}
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#FDE8EF] text-[#FF407D] border border-[#F8BBD0] hidden sm:inline-block">
            AI STUDIO
          </span>
        </div>

        {/* Center: Desktop Nav Links with Underline Indicator */}
        <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-2 text-sm font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? 'text-[#FF407D]'
                    : 'text-[#4A4147] hover:text-[#FF407D]'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="w-5 h-5 rounded-full bg-[#FF407D] text-white text-[11px] font-bold flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
                {/* Active Underline Pill Indicator */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FF407D] rounded-full shadow-[0_2px_8px_rgba(255,64,125,0.4)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3 shrink-0">
          


          {/* User Profile or Sign In Button */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white border border-[#EFE9E2] hover:border-[#F8BBD0] transition-all shadow-sm"
              >
                <User className="w-4 h-4 text-[#4A4147]" />
                <span className="text-xs font-semibold text-[#1E1B1D] hidden sm:inline-block max-w-[90px] truncate">
                  {user.name}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-[#F3DCE4] shadow-xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-[#F3DCE4]">
                    <p className="text-xs font-bold text-[#1E1B1D] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#6F626A] truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/wardrobe"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#4A4147] hover:bg-[#FDE8EF] hover:text-[#FF407D] transition-colors font-medium"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-[#FF407D]" />
                    <span>My Wardrobe</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-[#FF407D] hover:bg-[#FDE8EF] transition-colors text-left font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#FFF0F5] border border-[#EFE9E2] text-xs font-semibold text-[#1E1B1D] transition-all shadow-sm"
            >
              <User className="w-4 h-4 text-[#4A4147]" />
              <span>Sign In</span>
            </Link>
          )}



          {/* Mobile / Half-Screen Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-full bg-white border border-[#EFE9E2] text-[#1E1B1D]"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Half-Screen Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-[#F3DCE4] bg-white/98 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#FDE8EF] text-[#FF407D]'
                    : 'text-[#4A4147] hover:bg-[#FAF8F5]'
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="w-5 h-5 rounded-full bg-[#FF407D] text-white text-[11px] font-bold flex items-center justify-center">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
