// ============================================================
// VIEWMODEL: Dashboard — Manages dashboard analytics state
// Logic Layer (MVVM - ViewModel)
// Aggregates data from multiple services for the dashboard
// ============================================================

import { create } from "zustand";
import {
  DashboardStats,
  MonthlyPayrollData,
  DepartmentDistribution,
} from "@/models/Dashboard";
import * as employeeService from "@/services/employeeService";
import * as payrollService from "@/services/payrollService";

interface DashboardState {
  stats: DashboardStats;
  monthlyData: MonthlyPayrollData[];
  departmentData: DepartmentDistribution[];
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  fetchDashboardData: () => Promise<void>;
  clearError: () => void;
}

type DashboardViewModel = DashboardState & DashboardActions;

const DEPT_COLORS: Record<string, string> = {
  engineering: "#3b82f6",
  marketing: "#ef4444",
  sales: "#f59e0b",
  hr: "#8b5cf6",
  finance: "#10b981",
  operations: "#06b6d4",
  design: "#ec4899",
  support: "#6366f1",
};

export const useDashboardViewModel = create<DashboardViewModel>((set) => ({
  // Initial state
  stats: {
    totalEmployees: 0,
    activeEmployees: 0,
    totalPayrollThisMonth: 0,
    pendingPayrolls: 0,
    averageSalary: 0,
    attendanceRate: 0,
  },
  monthlyData: [],
  departmentData: [],
  isLoading: false,
  error: null,

  // Fetch all dashboard data
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      // Fetch employees and payrolls in parallel
      const [employees, payrolls] = await Promise.all([
        employeeService.getAllEmployees(),
        payrollService.getAllPayrolls(),
      ]);

      const activeEmployees = employees.filter((e) => e.status === "active");
      const now = new Date();
      const currentMonthPayrolls = payrolls.filter(
        (p) => p.month === now.getMonth() + 1 && p.year === now.getFullYear()
      );

      // Stats
      const stats: DashboardStats = {
        totalEmployees: employees.length,
        activeEmployees: activeEmployees.length,
        totalPayrollThisMonth: currentMonthPayrolls.reduce(
          (sum, p) => sum + (p.netSalary || 0),
          0
        ),
        pendingPayrolls: currentMonthPayrolls.filter(
          (p) => p.status === "processed" || p.status === "draft"
        ).length,
        averageSalary:
          activeEmployees.length > 0
            ? activeEmployees.reduce((sum, e) => sum + e.basicSalary, 0) /
              activeEmployees.length
            : 0,
        attendanceRate: 92.5, // Placeholder — would come from attendance data
      };

      // Department distribution
      const deptMap = new Map<string, number>();
      activeEmployees.forEach((e) => {
        deptMap.set(e.department, (deptMap.get(e.department) || 0) + 1);
      });
      const departmentData: DepartmentDistribution[] = Array.from(
        deptMap.entries()
      ).map(([dept, count]) => ({
        department: dept,
        count,
        color: DEPT_COLORS[dept] || "#94a3b8",
      }));

      // Monthly payroll trend (last 6 months)
      const monthlyData: MonthlyPayrollData[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const mPayrolls = payrolls.filter(
          (p) => p.month === d.getMonth() + 1 && p.year === d.getFullYear()
        );
        monthlyData.push({
          month: d.toLocaleString("default", { month: "short" }),
          totalPaid: mPayrolls.reduce((s, p) => s + (p.netSalary || 0), 0),
          totalDeductions: mPayrolls.reduce(
            (s, p) => s + (p.totalDeductions || 0),
            0
          ),
        });
      }

      set({ stats, monthlyData, departmentData, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch dashboard data";
      set({ error: message, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
