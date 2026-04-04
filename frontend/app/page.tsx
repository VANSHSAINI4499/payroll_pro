// ============================================================
// VIEW: Root Page — Landing page or Dashboard
// UI Layer (MVVM - View) — NO business logic
// ============================================================

"use client";

import React from "react";
import { useAuthViewModel } from "@/viewmodels/useAuthViewModel";
import DashboardView from "@/views/DashboardView";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LandingPage from "@/views/landing/LandingPage";

export default function HomePage() {
  const { isAuthenticated } = useAuthViewModel();

  // Show landing page for visitors, dashboard for logged-in users
  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <DashboardLayout>
      <DashboardView />
    </DashboardLayout>
  );
}
