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
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Menu button (mobile) */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <HiMenu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        {/* Center: Search (placeholder) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <HiSun className="h-5 w-5 text-yellow-400" />
            ) : (
              <HiMoon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative">
            <HiBell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-700">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-medium">
              {user?.displayName?.charAt(0) || "A"}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {user?.displayName || "Admin"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
