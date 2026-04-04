// ============================================================
// VIEW: Payroll — Payroll processing panel
// UI Layer (MVVM - View) — NO business logic here
// All state/logic delegated to usePayrollViewModel
// ============================================================

"use client";

import React, { useEffect, useState } from "react";
import { HiCurrencyDollar, HiCheckCircle, HiCash } from "react-icons/hi";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/ui/DataTable";
import { usePayrollViewModel } from "@/viewmodels/usePayrollViewModel";
import { useEmployeeViewModel } from "@/viewmodels/useEmployeeViewModel";
import { Payroll, SalaryCalculationRequest } from "@/models/Payroll";
import { formatCurrency, formatMonthYear } from "@/utils/helpers";

export default function PayrollView() {
  const {
    payrolls,
    isLoading,
    isProcessing,
    fetchPayrolls,
    processPayroll,
    updateStatus,
  } = usePayrollViewModel();

  const { employees, fetchEmployees } = useEmployeeViewModel();

  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [processMonth, setProcessMonth] = useState(new Date().getMonth() + 1);
  const [processYear, setProcessYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, [fetchPayrolls, fetchEmployees]);

  // Process payroll for selected employee
  const handleProcess = async () => {
    const emp = employees.find((e) => e.id === selectedEmployeeId);
    if (!emp) return toast.error("Select an employee");

    const request: SalaryCalculationRequest = {
      employeeId: emp.id,
      basicSalary: emp.basicSalary,
      month: processMonth,
      year: processYear,
      totalWorkingDays: 22,
      daysWorked: 22,   // Default: full month
      overtimeHours: 0,
    };

    try {
      await processPayroll(request, `${emp.firstName} ${emp.lastName}`);
      toast.success("Payroll processed successfully");
      setShowProcessModal(false);
    } catch {
      toast.error("Failed to process payroll");
    }
  };

  // Approve payroll
  const handleApprove = async (payroll: Payroll) => {
    try {
      await updateStatus(payroll.id, "approved");
      toast.success("Payroll approved");
    } catch {
      toast.error("Failed to approve");
    }
  };

  // Mark as paid
  const handlePay = async (payroll: Payroll) => {
    try {
      await updateStatus(payroll.id, "paid");
      toast.success("Payroll marked as paid");
    } catch {
      toast.error("Failed to update");
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1),
    label: new Date(2024, i, 1).toLocaleString("default", { month: "long" }),
  }));

  const years = Array.from({ length: 5 }, (_, i) => {
    const y = new Date().getFullYear() - 2 + i;
    return { value: String(y), label: String(y) };
  });

  const columns = [
    {
      key: "employeeName",
      header: "Employee",
      render: (p: Payroll) => (
        <div>
          <p className="font-medium">{p.employeeName}</p>
          <p className="text-xs text-gray-500">{p.employeeId}</p>
        </div>
      ),
    },
    {
      key: "period",
      header: "Period",
      render: (p: Payroll) => formatMonthYear(p.month, p.year),
    },
    {
      key: "basicSalary",
      header: "Basic",
      render: (p: Payroll) => formatCurrency(p.basicSalary),
    },
    {
      key: "grossSalary",
      header: "Gross",
      render: (p: Payroll) => formatCurrency(p.grossSalary),
    },
    {
      key: "totalDeductions",
      header: "Deductions",
      render: (p: Payroll) => (
        <span className="text-red-600">{formatCurrency(p.totalDeductions)}</span>
      ),
    },
    {
      key: "netSalary",
      header: "Net Pay",
      render: (p: Payroll) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(p.netSalary)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p: Payroll) => <Badge status={p.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (p: Payroll) => (
        <div className="flex items-center gap-1">
          {p.status === "processed" && (
            <button
              onClick={() => handleApprove(p)}
              className="p-1.5 rounded-lg hover:bg-green-500/10 transition-colors"
              title="Approve"
            >
              <HiCheckCircle className="h-5 w-5 text-green-500" />
            </button>
          )}
          {p.status === "approved" && (
            <button
              onClick={() => handlePay(p)}
              className="p-1.5 rounded-lg hover:bg-emerald-500/10 transition-colors"
              title="Mark as Paid"
            >
              <HiCash className="h-5 w-5 text-emerald-500" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Payroll Management</h1>
          <p className="page-subheader">
            Process and manage employee payroll
          </p>
        </div>
        <Button onClick={() => setShowProcessModal(true)}>
          <HiCurrencyDollar className="h-4 w-4 mr-1" />
          Process Payroll
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-primary-500/10 blur-xl" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Processed</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {payrolls.length}
          </p>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-green-500/10 blur-xl" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Payouts</p>
          <p className="text-3xl font-bold text-green-500 mt-1">
            {formatCurrency(
              payrolls
                .filter((p) => p.status === "paid")
                .reduce((s, p) => s + p.netSalary, 0)
            )}
          </p>
        </Card>
        <Card className="relative overflow-hidden">
          <div className="absolute -top-4 -right-4 h-16 w-16 rounded-full bg-orange-500/10 blur-xl" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Approval</p>
          <p className="text-3xl font-bold text-orange-500 mt-1">
            {payrolls.filter((p) => p.status === "processed").length}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={payrolls}
          keyExtractor={(p) => p.id}
          isLoading={isLoading}
          emptyMessage="No payrolls processed yet"
        />
      </Card>

      {/* Process Payroll Modal */}
      <Modal
        isOpen={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        title="Process Payroll"
        size="lg"
      >
        <div className="space-y-4">
          <Select
            label="Employee"
            placeholder="Select employee..."
            options={employees
              .filter((e) => e.status === "active")
              .map((e) => ({
                value: e.id,
                label: `${e.firstName} ${e.lastName} — ${formatCurrency(e.basicSalary)}/mo`,
              }))}
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Month"
              options={months}
              value={String(processMonth)}
              onChange={(e) => setProcessMonth(Number(e.target.value))}
            />
            <Select
              label="Year"
              options={years}
              value={String(processYear)}
              onChange={(e) => setProcessYear(Number(e.target.value))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
            <Button variant="secondary" onClick={() => setShowProcessModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcess} isLoading={isProcessing}>
              Process Payroll
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
