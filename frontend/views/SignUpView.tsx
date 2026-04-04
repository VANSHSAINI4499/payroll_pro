// ============================================================
// VIEW: Sign Up — Admin registration screen
// UI Layer (MVVM - View) — NO business logic here
// All state/logic delegated to useAuthViewModel
// ============================================================

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiCurrencyDollar, HiMail, HiLockClosed, HiUser } from "react-icons/hi";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuthViewModel } from "@/viewmodels/useAuthViewModel";
import { APP_NAME } from "@/config/constants";
import Link from "next/link";

export default function SignUpView() {
  const router = useRouter();
  const { signup, isLoading, error, clearError } = useAuthViewModel();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await signup(email, password, displayName);
      toast.success("Account created successfully!");
      router.push("/");
    } catch {
      toast.error("Failed to create account");
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

        {/* Sign Up Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Create Admin Account
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <HiUser className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="pl-10"
                required
              />
            </div>

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

            <div className="relative">
              <HiLockClosed className="absolute left-3 top-9 h-5 w-5 text-gray-400" />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
