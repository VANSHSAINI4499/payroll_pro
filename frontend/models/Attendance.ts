// ============================================================
// MODEL: Attendance — Represents an attendance record
// Part of the Data Layer (MVVM - Model)
// ============================================================

export interface Attendance {
  id: string;
  employeeId: string;
  date: Date;
  checkIn: string;   // HH:mm format
  checkOut: string;   // HH:mm format
  status: AttendanceStatus;
  hoursWorked: number;
  overtime: number;   // hours beyond standard 8
  notes?: string;
  createdAt: Date;
}

export type AttendanceStatus = "present" | "absent" | "half-day" | "leave" | "holiday";

export interface AttendanceSummary {
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  totalPresent: number;
  totalAbsent: number;
  totalLeaves: number;
  totalHalfDays: number;
  totalHoursWorked: number;
  totalOvertime: number;
}

export interface AttendanceFormData {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
  notes?: string;
}
