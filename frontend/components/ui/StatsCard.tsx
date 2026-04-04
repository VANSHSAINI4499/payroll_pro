// ============================================================
// COMPONENT: StatsCard — Dashboard statistics card
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React from "react";
import { IconType } from "react-icons";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
}

const colorClasses = {
  blue: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 ring-1 ring-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 ring-1 ring-emerald-500/20",
  purple: "bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400 ring-1 ring-violet-500/20",
  orange: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 ring-1 ring-amber-500/20",
  red: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 ring-1 ring-red-500/20",
};

const glowClasses = {
  blue: "glow-blue",
  green: "glow-green",
  purple: "glow-purple",
  orange: "glow-orange",
  red: "",
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatsCardProps) {
  return (
    <div className={`glass-card p-6 group hover:scale-[1.02] transition-all duration-300 dark:${glowClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            {value}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                  trend.isPositive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl ${colorClasses[color]} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
