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
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  red: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "blue",
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {trend && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
