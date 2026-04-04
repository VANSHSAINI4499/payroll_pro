// ============================================================
// COMPONENT: HowItWorksSection — Animated timeline steps
// UI Layer (MVVM - View/Component) — NO business logic
// ============================================================

"use client";

import React from "react";
import { HiUserAdd, HiClipboardList, HiCash, HiDocumentDownload } from "react-icons/hi";

const steps = [
  {
    icon: HiUserAdd,
    title: "Add Employees",
    description: "Onboard your team with detailed profiles, department assignments, and bank account info.",
    color: "from-blue-500 to-cyan-500",
    ring: "ring-blue-500/20",
  },
  {
    icon: HiClipboardList,
    title: "Track Attendance",
    description: "Record daily check-in/check-out, leaves, overtime, and generate monthly reports.",
    color: "from-emerald-500 to-green-500",
    ring: "ring-emerald-500/20",
  },
  {
    icon: HiCash,
    title: "Auto Salary Calculation",
    description: "Salaries are calculated automatically with all allowances, deductions, and taxes applied.",
    color: "from-violet-500 to-purple-500",
    ring: "ring-violet-500/20",
  },
  {
    icon: HiDocumentDownload,
    title: "Generate Payslips",
    description: "Download professional payslips as PDF with complete earnings and deduction breakdowns.",
    color: "from-orange-500 to-amber-500",
    ring: "ring-orange-500/20",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 bg-[#0a0a1a]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-sm font-semibold text-violet-400 tracking-widest uppercase mb-3">
            How It Works
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
            Four simple steps to
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              streamlined payroll
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (desktop) */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`relative lg:flex items-center gap-12 ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } ${index > 0 ? "lg:mt-16" : ""}`}
                style={{ animation: `fade-in-up 0.6s ${0.15 * index}s ease-out both` }}
              >
                {/* Content side */}
                <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div
                    className={`inline-block p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]
                      hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-500`}
                  >
                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${step.color} mb-4 shadow-lg`}>
                      <step.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center number (desktop) */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center justify-center">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center ring-4 ${step.ring} ring-offset-2 ring-offset-[#0a0a1a] shadow-xl`}>
                    <span className="text-sm font-bold text-white">{index + 1}</span>
                  </div>
                </div>

                {/* Empty side for layout */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
