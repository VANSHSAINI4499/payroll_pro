// ============================================================
// VIEW: Attendance — Attendance tracking panel
// UI Layer (MVVM - View) — NO business logic here
// All state/logic delegated to useAttendanceViewModel
// ============================================================

"use client";

import React, { useEffect, useState } from "react";
import { HiPlus, HiCalendar } from "react-icons/hi";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/ui/DataTable";
import { useAttendanceViewModel } from "@/viewmodels/useAttendanceViewModel";
import { useEmployeeViewModel } from "@/viewmodels/useEmployeeViewModel";
import { Attendance, AttendanceFormData } from "@/models/Attendance";
import { formatDate } from "@/utils/helpers";

const defaultForm: AttendanceFormData = {
  employeeId: "",
  date: new Date().toISOString().split("T")[0],
  checkIn: "09:00",
  checkOut: "18:00",
  status: "present",
  notes: "",
};

export default function AttendanceView() {
  const {
    records,
    isLoading,
    selectedMonth,
    selectedYear,
    fetchByMonth,
    markAttendance,
    setSelectedMonth,
    setSelectedYear,
  } = useAttendanceViewModel();

  const { employees, fetchEmployees } = useEmployeeViewModel();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<AttendanceFormData>(defaultForm);

  useEffect(() => {
    fetchEmployees();
    fetchByMonth(selectedMonth, selectedYear);
  }, [fetchEmployees, fetchByMonth, selectedMonth, selectedYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await markAttendance(form);
      toast.success("Attendance marked");
      setShowModal(false);
      setForm(defaultForm);
    } catch {
      toast.error("Failed to mark attendance");
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
      key: "employeeId",
      header: "Employee",
      render: (rec: Attendance) => {
        const emp = employees.find((e) => e.id === rec.employeeId);
        return emp ? `${emp.firstName} ${emp.lastName}` : rec.employeeId;
      },
    },
    {
      key: "date",
      header: "Date",
      render: (rec: Attendance) => formatDate(rec.date),
    },
    { key: "checkIn", header: "Check In" },
    { key: "checkOut", header: "Check Out" },
    {
      key: "hoursWorked",
      header: "Hours",
      render: (rec: Attendance) => `${rec.hoursWorked}h`,
    },
    {
      key: "overtime",
      header: "Overtime",
      render: (rec: Attendance) =>
        rec.overtime > 0 ? `${rec.overtime}h` : "—",
    },
    {
      key: "status",
      header: "Status",
      render: (rec: Attendance) => <Badge status={rec.status} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Attendance Tracking</h1>
          <p className="page-subheader">
            Track and manage employee attendance
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <HiPlus className="h-4 w-4 mr-1" />
          Mark Attendance
        </Button>
      </div>

      {/* Month/Year Filter */}
      <Card className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex items-center gap-2">
          <HiCalendar className="h-5 w-5 text-gray-400" />
        </div>
        <Select
          label="Month"
          options={months}
          value={String(selectedMonth)}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        />
        <Select
          label="Year"
          options={years}
          value={String(selectedYear)}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        />
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={records}
          keyExtractor={(rec) => rec.id}
          isLoading={isLoading}
          emptyMessage="No attendance records for this period"
        />
      </Card>

      {/* Mark Attendance Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Mark Attendance"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Employee"
            placeholder="Select employee"
            options={employees
              .filter((e) => e.status === "active")
              .map((e) => ({
                value: e.id,
                label: `${e.firstName} ${e.lastName} (${e.employeeId})`,
              }))}
            value={form.employeeId}
            onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              required
            />
            <Select
              label="Status"
              options={[
                { value: "present", label: "Present" },
                { value: "absent", label: "Absent" },
                { value: "half-day", label: "Half Day" },
                { value: "leave", label: "Leave" },
                { value: "holiday", label: "Holiday" },
              ]}
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  status: e.target.value as AttendanceFormData["status"],
                }))
              }
            />
            <Input
              label="Check In"
              type="time"
              value={form.checkIn}
              onChange={(e) => setForm((p) => ({ ...p, checkIn: e.target.value }))}
            />
            <Input
              label="Check Out"
              type="time"
              value={form.checkOut}
              onChange={(e) => setForm((p) => ({ ...p, checkOut: e.target.value }))}
            />
          </div>
          <Input
            label="Notes"
            value={form.notes || ""}
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            placeholder="Optional notes..."
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="secondary" onClick={() => setShowModal(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Mark Attendance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
