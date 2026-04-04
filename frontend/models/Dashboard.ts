// ============================================================
// MODEL: Dashboard — Analytics data structures
// Part of the Data Layer (MVVM - Model)
// ============================================================

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  totalPayrollThisMonth: number;
  pendingPayrolls: number;
  averageSalary: number;
  attendanceRate: number; // percentage
}

export interface MonthlyPayrollData {
  month: string;
  totalPaid: number;
  totalDeductions: number;
}

export interface DepartmentDistribution {
  department: string;
  count: number;
  color: string;
}
