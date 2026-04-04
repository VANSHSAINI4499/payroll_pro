// ============================================================
// CONFIG: Constants — Application-wide constants
// ============================================================

export const APP_NAME = "PayrollPro";

export const COLLECTIONS = {
  USERS: "users",
  EMPLOYEES: "employees",
  ATTENDANCE: "attendance",
  PAYROLL: "payroll",
  PAYSLIPS: "payslips",
} as const;

export const DEPARTMENTS = [
  { value: "engineering", label: "Engineering" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "design", label: "Design" },
  { value: "support", label: "Support" },
] as const;

export const SALARY_CONSTANTS = {
  HRA_PERCENTAGE: 0.40,       // 40% of basic
  DA_PERCENTAGE: 0.12,        // 12% of basic
  TA_FIXED: 1600,             // Fixed travel allowance
  MEDICAL_FIXED: 1250,        // Fixed medical allowance
  PF_PERCENTAGE: 0.12,        // 12% of basic
  ESI_PERCENTAGE: 0.0075,     // 0.75% of gross (if gross < 21000)
  PROFESSIONAL_TAX: 200,      // Fixed monthly
  ESI_THRESHOLD: 21000,       // ESI applicable if gross < 21000
} as const;

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
