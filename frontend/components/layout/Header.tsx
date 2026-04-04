// ============================================================
// COMPONENT: Header — Top navigation bar
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React from "react";
import { HiMenu, HiMoon, HiSun, HiBell } from "react-icons/hi";
import { useAuthViewModel } from "@/viewmodels/useAuthViewModel";
import { useThemeViewModel } from "@/viewmodels/useThemeViewModel";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthViewModel();
  const { isDark, toggle } = useThemeViewModel();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0d0d24]/80 backdrop-blur-2xl border-b border-gray-200/60 dark:border-white/5">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 lg:hidden transition-colors"
        >
          <HiMenu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full rounded-xl border border-gray-200/60 dark:border-white/10 bg-gray-100/50 dark:bg-white/5 pl-10 pr-4 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <HiSun className="h-5 w-5 text-amber-400 hover:rotate-180 transition-transform duration-500" />
            ) : (
              <HiMoon className="h-5 w-5 text-gray-600 hover:rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 relative transition-colors">
            <HiBell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0d0d24]" />
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-2.5 pl-3 ml-1 border-l border-gray-200/60 dark:border-white/10">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-primary-500/20 ring-2 ring-white/20">
              {user?.displayName?.charAt(0) || "A"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-white leading-tight">
                {user?.displayName || "Admin"}
              </p>
              <p className="text-xs text-gray-400 leading-tight">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
