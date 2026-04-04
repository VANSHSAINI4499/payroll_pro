// ============================================================
// COMPONENT: Button — Reusable button with variants
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary:
    "bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40",
  secondary:
    "bg-gray-200/80 hover:bg-gray-300 text-gray-800 dark:bg-white/10 dark:hover:bg-white/15 dark:text-gray-200 backdrop-blur-sm",
  danger:
    "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/25",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-700 dark:hover:bg-white/10 dark:text-gray-300",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-xl font-medium
        transition-all duration-300 focus:outline-none focus:ring-2
        focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.97]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
