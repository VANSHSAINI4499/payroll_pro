// ============================================================
// VIEWMODEL: Employee — Manages employee state & CRUD logic
// Logic Layer (MVVM - ViewModel)
// Connects Employee Views ↔ Employee Service (Model)
// ============================================================

import { create } from "zustand";
import { Employee, EmployeeFormData } from "@/models/Employee";
import * as employeeService from "@/services/employeeService";

interface EmployeeState {
  employees: Employee[];
  selectedEmployee: Employee | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filterDepartment: string;
  filterStatus: string;
}

interface EmployeeActions {
  fetchEmployees: () => Promise<void>;
  fetchEmployeeById: (id: string) => Promise<void>;
  addEmployee: (data: EmployeeFormData) => Promise<string>;
  editEmployee: (id: string, data: Partial<EmployeeFormData>) => Promise<void>;
  removeEmployee: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterDepartment: (dept: string) => void;
  setFilterStatus: (status: string) => void;
  setSelectedEmployee: (emp: Employee | null) => void;
  clearError: () => void;
  // Computed
  getFilteredEmployees: () => Employee[];
}

type EmployeeViewModel = EmployeeState & EmployeeActions;

export const useEmployeeViewModel = create<EmployeeViewModel>((set, get) => ({
  // Initial state
  employees: [],
  selectedEmployee: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  filterDepartment: "all",
  filterStatus: "all",

  // Fetch all employees from Firestore
  fetchEmployees: async () => {
    set({ isLoading: true, error: null });
    try {
      const employees = await employeeService.getAllEmployees();
      set({ employees, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch employees";
      set({ error: message, isLoading: false });
    }
  },

  // Fetch single employee
  fetchEmployeeById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const employee = await employeeService.getEmployeeById(id);
      set({ selectedEmployee: employee, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch employee";
      set({ error: message, isLoading: false });
    }
  },

  // Add a new employee
  addEmployee: async (data: EmployeeFormData) => {
    set({ isLoading: true, error: null });
    try {
      const id = await employeeService.createEmployee(data);
      await get().fetchEmployees(); // Refresh list
      set({ isLoading: false });
      return id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to add employee";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Edit existing employee
  editEmployee: async (id: string, data: Partial<EmployeeFormData>) => {
    set({ isLoading: true, error: null });
    try {
      await employeeService.updateEmployee(id, data);
      await get().fetchEmployees(); // Refresh list
      set({ isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update employee";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Soft-delete (terminate) an employee
  removeEmployee: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await employeeService.deleteEmployee(id);
      await get().fetchEmployees(); // Refresh list
      set({ isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete employee";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Search & filter setters
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterDepartment: (dept) => set({ filterDepartment: dept }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSelectedEmployee: (emp) => set({ selectedEmployee: emp }),
  clearError: () => set({ error: null }),

  // Computed: get filtered employees list
  getFilteredEmployees: () => {
    const { employees, searchQuery, filterDepartment, filterStatus } = get();
    return employees.filter((emp) => {
      const matchesSearch =
        !searchQuery ||
        `${emp.firstName} ${emp.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        filterDepartment === "all" || emp.department === filterDepartment;

      const matchesStatus =
        filterStatus === "all" || emp.status === filterStatus;

      return matchesSearch && matchesDept && matchesStatus;
    });
  },
}));
