// ============================================================
// SERVICE: Payslip — Firebase CRUD for payslip records
// Part of the Service Layer (MVVM)
// ============================================================

import {
  collection,
  doc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Payslip } from "@/models/Payslip";
import { Payroll } from "@/models/Payroll";
import { COLLECTIONS } from "@/config/constants";

const payslipsRef = collection(db, COLLECTIONS.PAYSLIPS);

// Get all payslips
export async function getAllPayslips(): Promise<Payslip[]> {
  const q = query(payslipsRef, orderBy("generatedAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    generatedAt: doc.data().generatedAt?.toDate?.() || new Date(),
  })) as Payslip[];
}

// Get payslips by employee
export async function getPayslipsByEmployee(
  employeeId: string
): Promise<Payslip[]> {
  const q = query(
    payslipsRef,
    where("employeeId", "==", employeeId),
    orderBy("generatedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    generatedAt: doc.data().generatedAt?.toDate?.() || new Date(),
  })) as Payslip[];
}

// Generate a payslip from a payroll record
export async function generatePayslip(
  payroll: Payroll,
  employeeDesignation: string,
  department: string
): Promise<string> {
  const payslip: Omit<Payslip, "id"> = {
    payrollId: payroll.id,
    employeeId: payroll.employeeId,
    employeeName: payroll.employeeName,
    employeeDesignation,
    department,
    month: payroll.month,
    year: payroll.year,
    earnings: [
      { label: "Basic Salary", amount: payroll.basicSalary },
      { label: "House Rent Allowance", amount: payroll.allowances.hra },
      { label: "Dearness Allowance", amount: payroll.allowances.da },
      { label: "Travel Allowance", amount: payroll.allowances.ta },
      { label: "Medical Allowance", amount: payroll.allowances.medical },
      { label: "Special Allowance", amount: payroll.allowances.special },
      { label: "Overtime Pay", amount: payroll.allowances.overtime },
    ],
    deductions: [
      { label: "Provident Fund", amount: payroll.deductions.pf },
      { label: "ESI", amount: payroll.deductions.esi },
      { label: "Income Tax (TDS)", amount: payroll.deductions.tax },
      { label: "Professional Tax", amount: payroll.deductions.professionalTax },
      { label: "Loan Deduction", amount: payroll.deductions.loanDeduction },
      { label: "Other Deductions", amount: payroll.deductions.other },
    ],
    grossEarnings: payroll.grossSalary,
    totalDeductions: payroll.totalDeductions,
    netPay: payroll.netSalary,
    generatedAt: new Date(),
  };

  const docRef = await addDoc(payslipsRef, {
    ...payslip,
    generatedAt: Timestamp.fromDate(new Date()),
  });
  return docRef.id;
}
