// ============================================================
// COMPONENT: Badge — Status badge
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React from "react";
import { getStatusColor, capitalize } from "@/utils/helpers";

interface BadgeProps {
  status: string;
  className?: string;
}

export default function Badge({ status, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${getStatusColor(status)}
        ${className}
      `}
    >
      {capitalize(status)}
    </span>
  );
}
