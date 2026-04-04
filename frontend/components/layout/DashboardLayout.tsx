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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a1a]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 rounded-full border-4 border-primary-200 dark:border-primary-900/30" />
            <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">Loading PayrollPro...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a1a] flex">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden dark:block hidden">
        <div className="absolute -top-[40%] -left-[20%] w-[600px] h-[600px] rounded-full bg-primary-600/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[15%] w-[500px] h-[500px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 relative">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
