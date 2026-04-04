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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a1a] px-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-900/30 via-transparent to-violet-900/30" />
        <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-primary-600/15 blur-[120px] animate-float" />
        <div className="absolute -bottom-[200px] -left-[200px] w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[120px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary-500/5 blur-[150px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-600 shadow-2xl shadow-primary-500/30 mb-5">
            <HiCurrencyDollar className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{APP_NAME}</h1>
          <p className="mt-2 text-primary-300/70 text-sm">Payroll Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl shadow-black/30 p-8">
          <h2 className="text-xl font-semibold text-white mb-6">
            Sign in to your account
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <HiMail className="absolute left-3 top-9 h-5 w-5 text-gray-500" />
              <Input
                label="Email Address"
                type="email"
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-primary-500/50 focus:ring-primary-500/30"
                required
              />
            </div>

            <div className="relative">
              <HiLockClosed className="absolute left-3 top-9 h-5 w-5 text-gray-500" />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-primary-500/50 focus:ring-primary-500/30"
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

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Create Admin Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
