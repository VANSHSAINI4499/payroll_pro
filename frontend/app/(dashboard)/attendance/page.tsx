// ============================================================
// ROUTE: /attendance — Attendance Tracking page
// ============================================================

"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AttendanceView from "@/views/AttendanceView";

export default function AttendancePage() {
  return (
    <DashboardLayout>
      <AttendanceView />
    </DashboardLayout>
  );
}
