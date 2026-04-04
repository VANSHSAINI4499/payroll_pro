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
        bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-2xl
        border border-gray-200/60 dark:border-white/10
        shadow-lg shadow-gray-200/40 dark:shadow-black/20
        p-6 transition-all duration-300
        ${onClick ? "cursor-pointer hover:shadow-xl hover:scale-[1.01] hover:border-primary-300 dark:hover:border-primary-500/30" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
