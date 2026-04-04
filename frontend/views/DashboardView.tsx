// ============================================================
// VIEW: Dashboard — Main dashboard with analytics + 3D
// UI Layer (MVVM - View) — NO business logic here
// All state/logic delegated to useDashboardViewModel
// ============================================================

"use client";

import React, { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import {
  HiUserGroup,
  HiCurrencyDollar,
  HiClock,
  HiClipboardCheck,
  HiTrendingUp,
  HiChartBar,
} from "react-icons/hi";
import StatsCard from "@/components/ui/StatsCard";
import Card from "@/components/ui/Card";
import { useDashboardViewModel } from "@/viewmodels/useDashboardViewModel";
import { formatCurrency } from "@/utils/helpers";

// Lazy-load the 3D scene (client-only)
const Dashboard3DScene = dynamic(
  () => import("@/components/three/Dashboard3DScene"),
  { ssr: false, loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" /> }
);

export default function DashboardView() {
  const { stats, monthlyData, departmentData, isLoading, fetchDashboardData } =
    useDashboardViewModel();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="page-subheader">Overview of your payroll operations</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-white/5 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/60 dark:border-white/10">
          <HiClock className="h-4 w-4" />
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Employees"
          value={stats.totalEmployees}
          icon={HiUserGroup}
          color="blue"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatsCard
          title="Active Employees"
          value={stats.activeEmployees}
          icon={HiClipboardCheck}
          color="green"
        />
        <StatsCard
          title="Monthly Payroll"
          value={formatCurrency(stats.totalPayrollThisMonth)}
          icon={HiCurrencyDollar}
          color="purple"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={HiClock}
          color="orange"
          trend={{ value: 1.3, isPositive: true }}
        />
      </div>

      {/* 3D Visualization */}
      <Card className="overflow-hidden relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-violet-500/10 dark:bg-violet-500/20">
              <HiChartBar className="h-5 w-5 text-violet-600 dark:text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              3D Analytics
            </h2>
          </div>
          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1 rounded-full">Interactive — Drag to rotate</span>
        </div>
        <div className="h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-[#0a0a2e] via-[#0f0f3a] to-[#1a1a4e] border border-white/5 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-600/10 via-transparent to-violet-600/10 pointer-events-none" />
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Loading 3D scene...</span>
                </div>
              </div>
            }
          >
            <Dashboard3DScene
              departmentData={departmentData}
              monthlyData={monthlyData}
            />
          </Suspense>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-primary-500/10 dark:bg-primary-500/20">
              <HiTrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Monthly Payroll Trend
            </h2>
          </div>
          {isLoading ? (
            <div className="h-48 animate-pulse bg-gray-100 dark:bg-white/5 rounded-xl" />
          ) : (
            <div className="space-y-3">
              {monthlyData.map((item, index) => (
                <div key={item.month} className="flex items-center gap-3 group">
                  <span className="w-10 text-sm font-medium text-gray-500 dark:text-gray-400">
                    {item.month}
                  </span>
                  <div className="flex-1 h-8 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden relative">
                    <div
                      className="h-full rounded-xl transition-all duration-700 ease-out bg-gradient-to-r from-primary-500 to-primary-400 group-hover:from-primary-600 group-hover:to-primary-500 relative overflow-hidden"
                      style={{
                        width: `${
                          monthlyData.length > 0
                            ? (item.totalPaid /
                                Math.max(
                                  ...monthlyData.map((d) => d.totalPaid || 1)
                                )) *
                              100
                            : 0
                        }%`,
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 w-24 text-right">
                    {formatCurrency(item.totalPaid)}
                  </span>
                </div>
              ))}
              {monthlyData.length === 0 && (
                <div className="text-center py-10">
                  <HiChartBar className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No payroll data yet</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Department Distribution */}
        <Card>
          <div className="flex items-center gap-2 mb-5">
            <div className="p-2 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20">
              <HiUserGroup className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Department Distribution
            </h2>
          </div>
          {isLoading ? (
            <div className="h-48 animate-pulse bg-gray-100 dark:bg-white/5 rounded-xl" />
          ) : (
            <div className="space-y-3">
              {departmentData.map((dept) => {
                const total = departmentData.reduce((s, d) => s + d.count, 0) || 1;
                const pct = Math.round((dept.count / total) * 100);
                return (
                  <div key={dept.department} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-full ring-2 ring-offset-2 ring-offset-white dark:ring-offset-[#0a0a1a]"
                          style={{ backgroundColor: dept.color, ringColor: dept.color + "40" }}
                        />
                        <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                          {dept.department}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {dept.count} <span className="text-xs font-normal text-gray-400">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 group-hover:opacity-80"
                        style={{ width: `${pct}%`, backgroundColor: dept.color }}
                      />
                    </div>
                  </div>
                );
              })}
              {departmentData.length === 0 && (
                <div className="text-center py-10">
                  <HiUserGroup className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No employees yet</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
