// ============================================================
// COMPONENT: Navbar — Landing page sticky navigation
// UI Layer (MVVM - View/Component) — NO business logic
// ============================================================

"use client";

import React, { useEffect, useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

interface NavbarProps {
  onGetStarted: () => void;
  onScrollTo: (id: string) => void;
  mobileMenuOpen: boolean;
  onToggleMobile: () => void;
}

const navLinks = [
  { label: "Features", id: "features" },
  { label: "How It Works", id: "how-it-works" },
  { label: "About", id: "cta" },
];

export default function Navbar({
  onGetStarted,
  onScrollTo,
  mobileMenuOpen,
  onToggleMobile,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0a0a1a]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-2xl shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2.5 group cursor-pointer">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Payroll<span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Pro</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onScrollTo(link.id)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={onGetStarted}
              className="relative group px-5 py-2.5 text-sm font-medium text-white rounded-xl overflow-hidden transition-all duration-300"
              style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative">Get Started</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={onToggleMobile}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenuAlt3 className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0d24]/95 backdrop-blur-2xl border-t border-white/[0.06]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onScrollTo(link.id)}
                className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-white/[0.06]">
              <button
                onClick={onGetStarted}
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl hover:from-indigo-500 hover:to-violet-500 transition-all"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
