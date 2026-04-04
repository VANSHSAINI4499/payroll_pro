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
      <div>
        <h1 className="page-header">Dashboard</h1>
        <p className="page-subheader">Overview of your payroll operations</p>
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
      <Card className="overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <HiChartBar className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            3D Analytics Visualization
          </h2>
        </div>
        <div className="h-72 rounded-lg overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
          <Suspense
            fallback={
              <div className="h-full flex items-center justify-center text-gray-400">
                Loading 3D scene...
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
          <div className="flex items-center gap-2 mb-4">
            <HiTrendingUp className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Monthly Payroll Trend
            </h2>
          </div>
          {isLoading ? (
            <div className="h-48 animate-pulse bg-gray-100 dark:bg-gray-700 rounded" />
          ) : (
            <div className="space-y-3">
              {monthlyData.map((item) => (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="w-10 text-sm text-gray-500 dark:text-gray-400">
                    {item.month}
                  </span>
                  <div className="flex-1 h-6 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full transition-all duration-500"
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
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-24 text-right">
                    {formatCurrency(item.totalPaid)}
                  </span>
                </div>
              ))}
              {monthlyData.length === 0 && (
                <p className="text-center text-gray-400 py-8">No payroll data yet</p>
              )}
            </div>
          )}
        </Card>

        {/* Department Distribution */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <HiUserGroup className="h-5 w-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Department Distribution
            </h2>
          </div>
          {isLoading ? (
            <div className="h-48 animate-pulse bg-gray-100 dark:bg-gray-700 rounded" />
          ) : (
            <div className="space-y-3">
              {departmentData.map((dept) => (
                <div key={dept.department} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: dept.color }}
                  />
                  <span className="flex-1 text-sm capitalize text-gray-700 dark:text-gray-300">
                    {dept.department}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {dept.count}
                  </span>
                </div>
              ))}
              {departmentData.length === 0 && (
                <p className="text-center text-gray-400 py-8">No employees yet</p>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
