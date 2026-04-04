// ============================================================
// ROUTE: /payslips — Payslip Viewer page
// ============================================================

"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PayslipView from "@/views/PayslipView";

export default function PayslipsPage() {
  return (
    <DashboardLayout>
      <PayslipView />
    </DashboardLayout>
  );
}
