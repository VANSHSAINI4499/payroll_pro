// ============================================================
// MODEL: Payslip — Represents a generated payslip
// Part of the Data Layer (MVVM - Model)
// ============================================================

export interface Payslip {
  id: string;
  payrollId: string;
  employeeId: string;
  employeeName: string;
  employeeDesignation: string;
  department: string;
  month: number;
  year: number;
  earnings: PayslipEarning[];
  deductions: PayslipDeduction[];
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  generatedAt: Date;
  downloadURL?: string;
}

export interface PayslipEarning {
  label: string;
  amount: number;
}

export interface PayslipDeduction {
  label: string;
  amount: number;
}
