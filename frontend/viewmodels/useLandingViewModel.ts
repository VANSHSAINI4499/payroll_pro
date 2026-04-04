// ============================================================
// VIEWMODEL: Landing Page — Handles navigation + CTA logic
// Business Logic Layer (MVVM - ViewModel)
// ============================================================

"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

export function useLandingViewModel() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navigate to login/dashboard
  const handleGetStarted = useCallback(() => {
    router.push("/login");
  }, [router]);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  return {
    mobileMenuOpen,
    toggleMobileMenu,
    handleGetStarted,
    scrollToSection,
  };
}
