import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, Code2 } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-blush-border bg-pearl-warm pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-blush-primary p-[1px] flex items-center justify-center shadow-sm">
                <div className="w-full h-full bg-pearl-white rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blush-500" />
                </div>
              </div>
              <span className="text-base font-extrabold text-ink-900 font-outfit">
                TryN<span className="text-blush-500">Fit</span>
              </span>
            </div>
            <p className="text-xs text-ink-600 max-w-sm leading-relaxed mb-4">
              AI Virtual Try-On Studio allowing online shoppers to visualize clothing screenshots directly on their body with in-memory input processing and user-controlled history.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full badge-blush text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Input Privacy & User-Controlled History</span>
            </div>
          </div>

          {/* Quick Pages Navigation */}
          <div>
            <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3 font-outfit">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-ink-600">
              <li>
                <Link to="/" className="hover:text-blush-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/studio" className="hover:text-blush-500 transition-colors">
                  AI Try-On Studio
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-blush-500 transition-colors">
                  Explore Styles
                </Link>
              </li>
              <li>
                <Link to="/wardrobe" className="hover:text-blush-500 transition-colors">
                  Digital Wardrobe
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-blush-500 transition-colors">
                  How It Works & Tech
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blush-500 transition-colors">
                  Sign In / Create Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <h4 className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3 font-outfit">
              Architecture
            </h4>
            <ul className="space-y-1.5 text-xs text-ink-600">
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-500" />
                <span>React 18 + Tailwind CSS</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-400" />
                <span>Node.js + Express API</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Multer MemoryStorage (In-Memory Inputs)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-600" />
                <span>WEARFITS & FASHN VTON Models</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blush-300" />
                <span>Express Rate-Limiting</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blush-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
          <p>© {new Date().getFullYear()} TryNFit. Built as a full-stack virtual try-on application.</p>
          <p className="text-[11px] text-ink-400">
            No user images are ever retained or stored server-side.
          </p>
        </div>
      </div>
    </footer>
  );
};
