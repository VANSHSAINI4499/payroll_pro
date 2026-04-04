// ============================================================
// VIEW: Landing Page — Public landing/login page
// UI Layer (MVVM - View) — NO business logic
// ============================================================

"use client";

import React from "react";
import LoginView from "@/views/LoginView";
import { useAuthViewModel } from "@/viewmodels/useAuthViewModel";
import DashboardView from "@/views/DashboardView";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function HomePage() {
  const { isAuthenticated } = useAuthViewModel();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <DashboardLayout>
      <DashboardView />
    </DashboardLayout>
  );
}
