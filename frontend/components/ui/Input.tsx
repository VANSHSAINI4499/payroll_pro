// ============================================================
// COMPONENT: Input — Reusable form input
// UI Layer (MVVM - View/Component)
// ============================================================

"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full rounded-xl border px-3 py-2.5 text-sm
          bg-white dark:bg-white/5
          text-gray-900 dark:text-gray-100
          border-gray-300 dark:border-white/10
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
}
