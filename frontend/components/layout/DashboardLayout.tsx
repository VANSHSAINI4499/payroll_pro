// ============================================================
// COMPONENT: DashboardLayout — Main layout wrapper
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAuthViewModel } from "@/viewmodels/useAuthViewModel";
import { useThemeViewModel } from "@/viewmodels/useThemeViewModel";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading, initAuthListener } = useAuthViewModel();
  const { setDark } = useThemeViewModel();

  // Initialize auth listener on mount
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  // Initialize theme from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
    }
  }, [setDark]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
