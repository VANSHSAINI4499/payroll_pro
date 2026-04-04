// ============================================================
// ROUTE: /employees — Employee Management page
// ============================================================

"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import EmployeeView from "@/views/EmployeeView";

export default function EmployeesPage() {
  return (
    <DashboardLayout>
      <EmployeeView />
    </DashboardLayout>
  );
}
