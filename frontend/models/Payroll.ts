// ============================================================
// MODEL: Payroll — Represents a payroll record
// Part of the Data Layer (MVVM - Model)
// ============================================================

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  basicSalary: number;
  allowances: Allowances;
  deductions: Deductions;
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  status: PayrollStatus;
  processedAt: Date;
  paidAt?: Date;
  createdAt: Date;
}

export interface Allowances {
  hra: number;           // House Rent Allowance
  da: number;            // Dearness Allowance
  ta: number;            // Travel Allowance
  medical: number;       // Medical Allowance
  special: number;       // Special Allowance
  overtime: number;      // Overtime Pay
}

export interface Deductions {
  pf: number;            // Provident Fund
  esi: number;           // Employee State Insurance
  tax: number;           // Income Tax (TDS)
  professionalTax: number;
  loanDeduction: number;
  other: number;
}

export type PayrollStatus = "draft" | "processed" | "approved" | "paid" | "cancelled";

export interface SalaryCalculationRequest {
  employeeId: string;
  basicSalary: number;
  month: number;
  year: number;
  totalWorkingDays: number;
  daysWorked: number;
  overtimeHours: number;
}

export interface TaxCalculationRequest {
  annualIncome: number;
  regime: "old" | "new";
  investments?: TaxInvestments;
}

export interface TaxInvestments {
  section80C: number;
  section80D: number;
  hra: number;
  other: number;
}
