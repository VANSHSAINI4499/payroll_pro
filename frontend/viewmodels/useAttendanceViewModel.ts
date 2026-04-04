// ============================================================
// VIEWMODEL: Attendance — Manages attendance state & logic
// Logic Layer (MVVM - ViewModel)
// Connects Attendance Views ↔ Attendance Service (Model)
// ============================================================

import { create } from "zustand";
import { Attendance, AttendanceFormData, AttendanceSummary } from "@/models/Attendance";
import * as attendanceService from "@/services/attendanceService";

interface AttendanceState {
  records: Attendance[];
  summaries: AttendanceSummary[];
  isLoading: boolean;
  error: string | null;
  selectedMonth: number;
  selectedYear: number;
  selectedEmployeeId: string;
}

interface AttendanceActions {
  fetchAllAttendance: () => Promise<void>;
  fetchByEmployee: (employeeId: string) => Promise<void>;
  fetchByMonth: (month: number, year: number) => Promise<void>;
  markAttendance: (data: AttendanceFormData) => Promise<string>;
  updateRecord: (id: string, data: Partial<AttendanceFormData>) => Promise<void>;
  fetchSummary: (
    employeeId: string,
    employeeName: string,
    month: number,
    year: number
  ) => Promise<AttendanceSummary>;
  setSelectedMonth: (month: number) => void;
  setSelectedYear: (year: number) => void;
  setSelectedEmployeeId: (id: string) => void;
  clearError: () => void;
}

type AttendanceViewModel = AttendanceState & AttendanceActions;

const now = new Date();

export const useAttendanceViewModel = create<AttendanceViewModel>((set, get) => ({
  // Initial state
  records: [],
  summaries: [],
  isLoading: false,
  error: null,
  selectedMonth: now.getMonth() + 1,
  selectedYear: now.getFullYear(),
  selectedEmployeeId: "",

  // Fetch all attendance records
  fetchAllAttendance: async () => {
    set({ isLoading: true, error: null });
    try {
      const records = await attendanceService.getAllAttendance();
      set({ records, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch attendance";
      set({ error: message, isLoading: false });
    }
  },

  // Fetch attendance by employee
  fetchByEmployee: async (employeeId: string) => {
    set({ isLoading: true, error: null });
    try {
      const records = await attendanceService.getAttendanceByEmployee(employeeId);
      set({ records, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch attendance";
      set({ error: message, isLoading: false });
    }
  },

  // Fetch attendance by month/year
  fetchByMonth: async (month: number, year: number) => {
    set({ isLoading: true, error: null });
    try {
      const records = await attendanceService.getAttendanceByMonth(month, year);
      set({ records, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch attendance";
      set({ error: message, isLoading: false });
    }
  },

  // Mark attendance
  markAttendance: async (data: AttendanceFormData) => {
    set({ isLoading: true, error: null });
    try {
      const id = await attendanceService.createAttendance(data);
      // Refresh current view
      const { selectedMonth, selectedYear } = get();
      await get().fetchByMonth(selectedMonth, selectedYear);
      set({ isLoading: false });
      return id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to mark attendance";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Update attendance record
  updateRecord: async (id: string, data: Partial<AttendanceFormData>) => {
    set({ isLoading: true, error: null });
    try {
      await attendanceService.updateAttendance(id, data);
      const { selectedMonth, selectedYear } = get();
      await get().fetchByMonth(selectedMonth, selectedYear);
      set({ isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update attendance";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Get attendance summary
  fetchSummary: async (
    employeeId: string,
    employeeName: string,
    month: number,
    year: number
  ) => {
    const summary = await attendanceService.getAttendanceSummary(
      employeeId,
      employeeName,
      month,
      year
    );
    set((state) => ({
      summaries: [
        ...state.summaries.filter(
          (s) =>
            !(
              s.employeeId === employeeId &&
              s.month === month &&
              s.year === year
            )
        ),
        summary,
      ],
    }));
    return summary;
  },

  setSelectedMonth: (month) => set({ selectedMonth: month }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedEmployeeId: (id) => set({ selectedEmployeeId: id }),
  clearError: () => set({ error: null }),
}));
