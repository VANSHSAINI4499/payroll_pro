// ============================================================
// MODEL: Employee — Represents an employee record
// Part of the Data Layer (MVVM - Model)
// ============================================================

export interface Employee {
  id: string;
  employeeId: string; // e.g., "EMP-001"
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  dateOfJoining: Date;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  address: Address;
  bankDetails: BankDetails;
  basicSalary: number;
  status: "active" | "inactive" | "terminated";
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export type Department =
  | "engineering"
  | "marketing"
  | "sales"
  | "hr"
  | "finance"
  | "operations"
  | "design"
  | "support";

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  dateOfJoining: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  address: Address;
  bankDetails: BankDetails;
  basicSalary: number;
}
