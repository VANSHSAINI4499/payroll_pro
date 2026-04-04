// ============================================================
// VIEW: Login — Admin login screen
// UI Layer (MVVM - View) — NO business logic here
// All state/logic delegated to useAuthViewModel
// ============================================================

"use client";

import React, { useState } from "react";
import { HiCurrencyDollar, HiMail, HiLockClosed } from "react-icons/hi";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuthViewModel } from "@/viewmodels/useAuthViewModel";
import { APP_NAME } from "@/config/constants";
import Link from "next/link";

export default function LoginView() {
  const { login, isLoading, error, clearError } = useAuthViewModel();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login(email, password);
      toast.success("Welcome back!");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-primary-400/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
            <HiCurrencyDollar className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">{APP_NAME}</h1>
          <p className="mt-2 text-primary-200">Payroll Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Sign in to your account
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <HiMail className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <div className="relative">
              <HiLockClosed className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full mt-6"
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Create Admin Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
