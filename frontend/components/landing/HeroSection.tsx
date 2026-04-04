// ============================================================
// COMPONENT: HeroSection — Premium hero with animated background
// UI Layer (MVVM - View/Component) — NO business logic
// Uses CSS animations for beams, gradients, particles
// ============================================================

"use client";

import React from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

// Animated beam element for background
function AnimatedBeam({ delay, left }: { delay: number; left: string }) {
  return (
    <div
      className="absolute w-[1px] h-[200px] opacity-0"
      style={{
        left,
        background: "linear-gradient(180deg, transparent, rgba(99,102,241,0.3), transparent)",
        animation: `beam 8s ${delay}s ease-in-out infinite`,
      }}
    />
  );
}

// Floating gradient orb
function GradientOrb({
  className,
  colors,
}: {
  className: string;
  colors: string;
}) {
  return (
    <div
      className={`absolute rounded-full blur-[100px] opacity-20 ${className}`}
      style={{ background: colors }}
    />
  );
}

export default function HeroSection({ onGetStarted, onLearnMore }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a1a]">
      {/* ===== Animated Background ===== */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/50 via-[#0a0a1a] to-[#0a0a1a]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Gradient orbs */}
        <GradientOrb
          className="w-[600px] h-[600px] -top-[200px] -left-[200px] animate-float"
          colors="radial-gradient(circle, rgba(99,102,241,0.4), transparent 70%)"
        />
        <GradientOrb
          className="w-[500px] h-[500px] top-[20%] -right-[100px] animate-float-delayed"
          colors="radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)"
        />
        <GradientOrb
          className="w-[400px] h-[400px] bottom-[10%] left-[30%] animate-float"
          colors="radial-gradient(circle, rgba(6,182,212,0.2), transparent 70%)"
        />

        {/* Animated beams */}
        <AnimatedBeam delay={0} left="20%" />
        <AnimatedBeam delay={2} left="40%" />
        <AnimatedBeam delay={4} left="60%" />
        <AnimatedBeam delay={6} left="80%" />
        <AnimatedBeam delay={1} left="10%" />
        <AnimatedBeam delay={3} left="70%" />
        <AnimatedBeam delay={5} left="90%" />

        {/* Radial spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.08)_0%,_transparent_70%)]" />
      </div>

      {/* ===== Content ===== */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] mb-8"
          style={{ animation: "fade-in-up 0.8s ease-out forwards" }}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-gray-300">
            Trusted by 500+ companies worldwide
          </span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          style={{ animation: "fade-in-up 0.8s 0.2s ease-out both" }}
        >
          <span className="text-white">Simplify Payroll.</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Empower Your Business.
          </span>
        </h1>

        {/* Subtext */}
        <p
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animation: "fade-in-up 0.8s 0.4s ease-out both" }}
        >
          Manage employees, track attendance, calculate salaries, and generate
          payslips — all in one powerful platform.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: "fade-in-up 0.8s 0.6s ease-out both" }}
        >
          {/* Primary CTA - Glowing button */}
          <button
            onClick={onGetStarted}
            className="relative group px-8 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-[1px] bg-gradient-to-r from-indigo-600 to-violet-600 rounded-[15px]" />
            <span className="relative flex items-center gap-2">
              Get Started Free
              <svg className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onLearnMore}
            className="group px-8 py-4 text-base font-medium text-gray-300 hover:text-white rounded-2xl border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.03] transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Learn More
              <svg className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
        </div>

        {/* Dashboard Preview Card */}
        <div
          className="mt-20 relative mx-auto max-w-4xl"
          style={{ animation: "scale-in 1s 0.8s ease-out both" }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm shadow-2xl shadow-indigo-500/10">
            {/* Glare effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />

            {/* Mock dashboard */}
            <div className="p-4 sm:p-6">
              {/* Top bar */}
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <div className="flex-1 mx-4 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06]" />
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                {/* Stats cards */}
                {[
                  { label: "Total Employees", value: "2,847", color: "from-blue-500/20 to-blue-600/5" },
                  { label: "Total Payroll", value: "$4.2M", color: "from-green-500/20 to-green-600/5" },
                  { label: "Processed", value: "98.5%", color: "from-violet-500/20 to-violet-600/5" },
                  { label: "Departments", value: "12", color: "from-cyan-500/20 to-cyan-600/5" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`rounded-xl bg-gradient-to-br ${stat.color} border border-white/[0.06] p-3`}
                  >
                    <p className="text-[10px] text-gray-500 truncate">{stat.label}</p>
                    <p className="text-sm font-bold text-white mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div className="h-32 sm:h-44 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-end justify-around px-4 pb-4">
                {[65, 45, 80, 55, 90, 70, 85, 50, 75, 60, 95, 82].map((h, i) => (
                  <div
                    key={i}
                    className="w-full max-w-[20px] rounded-t-md bg-gradient-to-t from-indigo-600/60 to-violet-500/40"
                    style={{
                      height: `${h}%`,
                      animation: `fade-in-up 0.5s ${0.8 + i * 0.05}s ease-out both`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Glow behind card */}
          <div className="absolute -inset-10 bg-gradient-to-r from-indigo-600/10 via-violet-600/10 to-cyan-600/10 blur-3xl -z-10 rounded-full" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
