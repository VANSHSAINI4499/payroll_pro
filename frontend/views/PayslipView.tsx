// ============================================================
// VIEW: Payslips — Payslip viewer
// UI Layer (MVVM - View) — NO business logic here
// ============================================================

"use client";

import React, { useEffect } from "react";
import { HiDocumentText, HiDownload } from "react-icons/hi";
import Card from "@/components/ui/Card";
import DataTable from "@/components/ui/DataTable";
import { Payslip } from "@/models/Payslip";
import { formatCurrency, formatMonthYear } from "@/utils/helpers";
// Payslip data is fetched from the payslip service directly in a simple store
import { create } from "zustand";
import * as payslipService from "@/services/payslipService";

// Mini ViewModel for payslips (inline for simplicity)
interface PayslipState {
  payslips: Payslip[];
  isLoading: boolean;
  fetchPayslips: () => Promise<void>;
}

const usePayslipStore = create<PayslipState>((set) => ({
  payslips: [],
  isLoading: false,
  fetchPayslips: async () => {
    set({ isLoading: true });
    try {
      const payslips = await payslipService.getAllPayslips();
      set({ payslips, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));

export default function PayslipView() {
  const { payslips, isLoading, fetchPayslips } = usePayslipStore();

  useEffect(() => {
    fetchPayslips();
  }, [fetchPayslips]);

  const columns = [
    {
      key: "employeeName",
      header: "Employee",
      render: (p: Payslip) => (
        <div>
          <p className="font-medium">{p.employeeName}</p>
          <p className="text-xs text-gray-500">{p.employeeDesignation}</p>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (p: Payslip) => <span className="capitalize">{p.department}</span>,
    },
    {
      key: "period",
      header: "Period",
      render: (p: Payslip) => formatMonthYear(p.month, p.year),
    },
    {
      key: "grossEarnings",
      header: "Gross",
      render: (p: Payslip) => formatCurrency(p.grossEarnings),
    },
    {
      key: "totalDeductions",
      header: "Deductions",
      render: (p: Payslip) => (
        <span className="text-red-600">{formatCurrency(p.totalDeductions)}</span>
      ),
    },
    {
      key: "netPay",
      header: "Net Pay",
      render: (p: Payslip) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(p.netPay)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (_p: Payslip) => (
        <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" title="Download">
          <HiDownload className="h-4 w-4 text-primary-600" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <HiDocumentText className="h-7 w-7 text-primary-600" />
        <div>
          <h1 className="page-header">Payslips</h1>
          <p className="page-subheader">View and download employee payslips</p>
        </div>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={payslips}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          emptyMessage="No payslips generated yet. Process payroll first."
        />
      </Card>
    </div>
  );
}
