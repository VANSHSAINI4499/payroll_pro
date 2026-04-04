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
import { create } from "zustand";
import * as payslipService from "@/services/payslipService";

function downloadPayslipPDF(p: Payslip) {
  const monthYear = formatMonthYear(p.month, p.year);

  const earningsRows = p.earnings
    .filter((e) => e.amount > 0)
    .map(
      (e) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">${e.label}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:right">${formatCurrency(e.amount)}</td></tr>`
    )
    .join("");

  const deductionRows = p.deductions
    .filter((d) => d.amount > 0)
    .map(
      (d) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb">${d.label}</td><td style="padding:6px 12px;border-bottom:1px solid #e5e7eb;text-align:right;color:#dc2626">${formatCurrency(d.amount)}</td></tr>`
    )
    .join("");

  const html = `<!DOCTYPE html>
<html><head><title>Payslip - ${p.employeeName} - ${monthYear}</title>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; padding:40px; color:#1f2937; background:#fff; }
  .header { text-align:center; margin-bottom:30px; border-bottom:3px solid #2563eb; padding-bottom:20px; }
  .header h1 { color:#2563eb; font-size:24px; }
  .header p { color:#6b7280; margin-top:4px; }
  .info-grid { display:flex; justify-content:space-between; margin-bottom:30px; }
  .info-box { flex:1; }
  .info-box h3 { font-size:12px; text-transform:uppercase; color:#6b7280; margin-bottom:8px; letter-spacing:1px; }
  .info-box p { font-size:14px; margin-bottom:4px; }
  .tables { display:flex; gap:30px; margin-bottom:30px; }
  .tables > div { flex:1; }
  table { width:100%; border-collapse:collapse; font-size:14px; }
  th { padding:8px 12px; background:#2563eb; color:#fff; text-align:left; }
  th:last-child { text-align:right; }
  .summary { display:flex; justify-content:space-between; background:#f3f4f6; padding:20px; border-radius:8px; margin-bottom:30px; }
  .summary-item { text-align:center; }
  .summary-item .label { font-size:12px; color:#6b7280; text-transform:uppercase; }
  .summary-item .value { font-size:22px; font-weight:bold; margin-top:4px; }
  .net { color:#16a34a; }
  .footer { text-align:center; margin-top:40px; padding-top:20px; border-top:1px solid #e5e7eb; color:#9ca3af; font-size:12px; }
  @media print { body { padding:20px; } }
</style></head><body>
  <div class="header">
    <h1>PayrollPro</h1>
    <p>Payroll Management System</p>
  </div>
  <h2 style="text-align:center;margin-bottom:20px;font-size:18px;">PAYSLIP — ${monthYear}</h2>
  <div class="info-grid">
    <div class="info-box">
      <h3>Employee Details</h3>
      <p><strong>Name:</strong> ${p.employeeName}</p>
      <p><strong>Designation:</strong> ${p.employeeDesignation || "N/A"}</p>
      <p><strong>Department:</strong> ${p.department || "N/A"}</p>
    </div>
    <div class="info-box" style="text-align:right">
      <h3>Pay Period</h3>
      <p><strong>Month:</strong> ${monthYear}</p>
      <p><strong>Generated:</strong> ${new Date(p.generatedAt).toLocaleDateString("en-IN")}</p>
    </div>
  </div>
  <div class="tables">
    <div>
      <table>
        <thead><tr><th>Earnings</th><th>Amount</th></tr></thead>
        <tbody>${earningsRows}
          <tr style="font-weight:bold;background:#f9fafb"><td style="padding:8px 12px">Total Earnings</td><td style="padding:8px 12px;text-align:right">${formatCurrency(p.grossEarnings)}</td></tr>
        </tbody>
      </table>
    </div>
    <div>
      <table>
        <thead><tr><th>Deductions</th><th>Amount</th></tr></thead>
        <tbody>${deductionRows}
          <tr style="font-weight:bold;background:#f9fafb"><td style="padding:8px 12px">Total Deductions</td><td style="padding:8px 12px;text-align:right;color:#dc2626">${formatCurrency(p.totalDeductions)}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="summary">
    <div class="summary-item"><div class="label">Gross Earnings</div><div class="value">${formatCurrency(p.grossEarnings)}</div></div>
    <div class="summary-item"><div class="label">Total Deductions</div><div class="value" style="color:#dc2626">${formatCurrency(p.totalDeductions)}</div></div>
    <div class="summary-item"><div class="label">Net Pay</div><div class="value net">${formatCurrency(p.netPay)}</div></div>
  </div>
  <div class="footer">
    <p>This is a system-generated payslip from PayrollPro. No signature required.</p>
    <p style="margin-top:8px"><button onclick="window.print()" style="padding:8px 24px;background:#2563eb;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px">Print / Save as PDF</button></p>
  </div>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

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
      render: (p: Payslip) => (
        <button
          onClick={() => downloadPayslipPDF(p)}
          className="p-1.5 rounded-lg hover:bg-primary-500/10 transition-colors"
          title="Download Payslip"
        >
          <HiDownload className="h-4 w-4 text-primary-500" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
          <HiDocumentText className="h-5 w-5 text-white" />
        </div>
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
