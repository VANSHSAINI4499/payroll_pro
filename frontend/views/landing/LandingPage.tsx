// ============================================================
// VIEW: LandingPage — Public-facing SaaS landing page
// UI Layer (MVVM - View) — NO business logic
// All actions delegated to useLandingViewModel
// ============================================================

"use client";

import React from "react";
import { useLandingViewModel } from "@/viewmodels/useLandingViewModel";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  const {
    mobileMenuOpen,
    toggleMobileMenu,
    handleGetStarted,
    scrollToSection,
  } = useLandingViewModel();

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Sticky Navbar */}
      <Navbar
        onGetStarted={handleGetStarted}
        onScrollTo={scrollToSection}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobile={toggleMobileMenu}
      />

      {/* Hero — full viewport with animated background */}
      <HeroSection
        onGetStarted={handleGetStarted}
        onLearnMore={() => scrollToSection("features")}
      />

      {/* Features grid */}
      <FeaturesSection />

      {/* How It Works timeline */}
      <HowItWorksSection />

      {/* Final CTA */}
      <CTASection onGetStarted={handleGetStarted} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
