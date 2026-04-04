// ============================================================
// COMPONENT: Card — Reusable card container
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-800 rounded-xl border border-gray-200
        dark:border-gray-700 shadow-sm p-6
        ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
