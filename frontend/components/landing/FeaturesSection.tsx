// ============================================================
// COMPONENT: FeaturesSection — Feature cards with hover effects
// UI Layer (MVVM - View/Component) — NO business logic
// ============================================================

"use client";

import React from "react";
import {
  HiUserGroup,
  HiClipboardCheck,
  HiCurrencyDollar,
  HiCalculator,
  HiDocumentText,
} from "react-icons/hi";

const features = [
  {
    icon: HiUserGroup,
    title: "Employee Management",
    description:
      "Add, update, and manage employee profiles with departments, designations, bank details, and more.",
    gradient: "from-blue-500 to-cyan-500",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    icon: HiClipboardCheck,
    title: "Attendance Tracking",
    description:
      "Track daily attendance, manage leave records, and monitor overtime hours with real-time updates.",
    gradient: "from-emerald-500 to-green-500",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: HiCurrencyDollar,
    title: "Salary Automation",
    description:
      "Automatically calculate salaries with HRA, DA, allowances, and deductions based on attendance.",
    gradient: "from-violet-500 to-purple-500",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    icon: HiCalculator,
    title: "Tax Calculation",
    description:
      "Built-in tax engine computes PF, ESI, professional tax, and income tax for accurate deductions.",
    gradient: "from-orange-500 to-amber-500",
    glow: "group-hover:shadow-orange-500/20",
  },
  {
    icon: HiDocumentText,
    title: "Payslip Generation",
    description:
      "Generate professional payslips instantly and download them as PDFs with full earnings breakdown.",
    gradient: "from-pink-500 to-rose-500",
    glow: "group-hover:shadow-pink-500/20",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 lg:py-32 bg-[#0a0a1a]">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-sm font-semibold text-indigo-400 tracking-widest uppercase mb-3">
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              manage payroll
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A complete suite of tools designed to simplify your payroll workflow
            from employee onboarding to payslip generation.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl bg-white/[0.02] border border-white/[0.06] p-7 hover:bg-white/[0.04] hover:border-white/[0.1]
                transition-all duration-500 hover:shadow-2xl ${feature.glow} cursor-default
                ${index >= 3 ? "lg:col-span-1 lg:last:col-start-2" : ""}
              `}
              style={{
                animation: `fade-in-up 0.6s ${0.1 * index}s ease-out both`,
              }}
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} mb-5 shadow-lg
                  group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Text */}
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>

              {/* Hover glow line at bottom */}
              <div
                className={`absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-40 transition-opacity duration-500`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
