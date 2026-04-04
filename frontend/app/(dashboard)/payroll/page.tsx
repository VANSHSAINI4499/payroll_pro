// ============================================================
// ROUTE: /payroll — Payroll Management page
// ============================================================

"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PayrollView from "@/views/PayrollView";

export default function PayrollPage() {
  return (
    <DashboardLayout>
      <PayrollView />
    </DashboardLayout>
  );
}
