// ============================================================
// VIEWMODEL: Payroll — Manages payroll processing & state
// Logic Layer (MVVM - ViewModel)
// Connects Payroll Views ↔ Payroll Service (Model)
// ============================================================

import { create } from "zustand";
import { Payroll, SalaryCalculationRequest } from "@/models/Payroll";
import * as payrollService from "@/services/payrollService";
import * as payslipService from "@/services/payslipService";
import * as employeeService from "@/services/employeeService";

interface PayrollState {
  payrolls: Payroll[];
  currentPayroll: Payroll | null;
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  selectedMonth: number;
  selectedYear: number;
}

interface PayrollActions {
  fetchPayrolls: () => Promise<void>;
  fetchByMonth: (month: number, year: number) => Promise<void>;
  processPayroll: (
    request: SalaryCalculationRequest,
    employeeName: string
  ) => Promise<string>;
  updateStatus: (id: string, status: Payroll["status"]) => Promise<void>;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  clearError: () => void;
}

type PayrollViewModel = PayrollState & PayrollActions;

const now = new Date();

export const usePayrollViewModel = create<PayrollViewModel>((set, get) => ({
  // Initial state
  payrolls: [],
  currentPayroll: null,
  isLoading: false,
  isProcessing: false,
  error: null,
  selectedMonth: now.getMonth() + 1,
  selectedYear: now.getFullYear(),

  // Fetch all payrolls
  fetchPayrolls: async () => {
    set({ isLoading: true, error: null });
    try {
      const payrolls = await payrollService.getAllPayrolls();
      set({ payrolls, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch payrolls";
      set({ error: message, isLoading: false });
    }
  },

  // Fetch payrolls by month
  fetchByMonth: async (month: number, year: number) => {
    set({ isLoading: true, error: null });
    try {
      const payrolls = await payrollService.getPayrollByMonth(month, year);
      set({ payrolls, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch payrolls";
      set({ error: message, isLoading: false });
    }
  },

  // Process payroll for an employee
  processPayroll: async (
    request: SalaryCalculationRequest,
    employeeName: string
  ) => {
    set({ isProcessing: true, error: null });
    try {
      // Calculate salary (tries API first, falls back to local)
      const calculation = await payrollService.calculateSalaryAPI(request);

      // Create payroll record
      const payroll: Omit<Payroll, "id"> = {
        employeeId: request.employeeId,
        employeeName,
        month: request.month,
        year: request.year,
        basicSalary: calculation.basicSalary,
        allowances: calculation.allowances,
        deductions: calculation.deductions,
        grossSalary: calculation.grossSalary,
        totalDeductions: calculation.totalDeductions,
        netSalary: calculation.netSalary,
        status: "processed",
        processedAt: new Date(),
        createdAt: new Date(),
      };

      const id = await payrollService.createPayroll(payroll);
      await get().fetchPayrolls(); // Refresh list
      set({ isProcessing: false });
      return id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to process payroll";
      set({ error: message, isProcessing: false });
      throw error;
    }
  },

  // Update payroll status (approve, pay, cancel)
  updateStatus: async (id: string, status: Payroll["status"]) => {
    set({ isLoading: true, error: null });
    try {
      await payrollService.updatePayrollStatus(id, status);

      // Auto-generate payslip when payroll is marked as paid
      if (status === "paid") {
        const payroll = get().payrolls.find((p) => p.id === id);
        if (payroll) {
          const employee = await employeeService.getEmployeeById(payroll.employeeId);
          const designation = employee?.designation || "";
          const department = employee?.department || "";
          await payslipService.generatePayslip(
            { ...payroll, status: "paid" },
            designation,
            department
          );
        }
      }

      await get().fetchPayrolls();
      set({ isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update status";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  clearError: () => set({ error: null }),
}));
