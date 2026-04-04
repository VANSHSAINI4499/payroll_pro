// ============================================================
// COMPONENT: CTASection — Call-to-action with glowing button
// UI Layer (MVVM - View/Component) — NO business logic
// ============================================================

"use client";

import React from "react";

interface CTASectionProps {
  onGetStarted: () => void;
}

export default function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section id="cta" className="relative py-24 lg:py-32 bg-[#0a0a1a] overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-violet-600/8 blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Card */}
        <div className="relative rounded-3xl bg-white/[0.02] border border-white/[0.08] p-12 lg:p-16 overflow-hidden">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-violet-600/5" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-5">
              Start Managing Payroll
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                the Smart Way
              </span>
            </h2>

            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
              Join hundreds of businesses that trust PayrollPro to handle their
              payroll efficiently and accurately.
            </p>

            {/* Glowing CTA Button */}
            <button
              onClick={onGetStarted}
              className="relative group inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
              style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative">Get Started Now</span>
              <svg className="relative h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <p className="mt-5 text-sm text-gray-500">
              No credit card required · Free forever for small teams
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
