// ============================================================
// SERVICE: Payroll — Firebase CRUD + Salary/Tax API calls
// Part of the Service Layer (MVVM)
// ============================================================

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Payroll, SalaryCalculationRequest, TaxCalculationRequest } from "@/models/Payroll";
import { COLLECTIONS, API_URL, SALARY_CONSTANTS } from "@/config/constants";

const payrollRef = collection(db, COLLECTIONS.PAYROLL);

// ===================== FIREBASE CRUD =====================

// Get all payroll records
export async function getAllPayrolls(): Promise<Payroll[]> {
  const q = query(payrollRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    processedAt: doc.data().processedAt?.toDate?.() || new Date(),
    paidAt: doc.data().paidAt?.toDate?.() || undefined,
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  })) as Payroll[];
}

// Get payroll by employee
export async function getPayrollByEmployee(
  employeeId: string
): Promise<Payroll[]> {
  const q = query(
    payrollRef,
    where("employeeId", "==", employeeId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Payroll[];
}

// Get payroll by month/year
export async function getPayrollByMonth(
  month: number,
  year: number
): Promise<Payroll[]> {
  const q = query(
    payrollRef,
    where("month", "==", month),
    where("year", "==", year)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Payroll[];
}

// Create payroll record
export async function createPayroll(payroll: Omit<Payroll, "id">): Promise<string> {
  const docRef = await addDoc(payrollRef, {
    ...payroll,
    processedAt: Timestamp.fromDate(new Date()),
    createdAt: Timestamp.fromDate(new Date()),
  });
  return docRef.id;
}

// Update payroll status
export async function updatePayrollStatus(
  id: string,
  status: Payroll["status"]
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.PAYROLL, id);
  const updateData: Record<string, unknown> = { status };
  if (status === "paid") {
    updateData.paidAt = Timestamp.fromDate(new Date());
  }
  await updateDoc(docRef, updateData);
}

// ===================== SALARY CALCULATION =====================

// Calculate salary locally (fallback if FastAPI is unavailable)
export function calculateSalaryLocal(request: SalaryCalculationRequest) {
  const { basicSalary, daysWorked, totalWorkingDays, overtimeHours } = request;

  // Pro-rated basic
  const proRatedBasic = (basicSalary / totalWorkingDays) * daysWorked;

  // Allowances
  const hra = proRatedBasic * SALARY_CONSTANTS.HRA_PERCENTAGE;
  const da = proRatedBasic * SALARY_CONSTANTS.DA_PERCENTAGE;
  const ta = SALARY_CONSTANTS.TA_FIXED;
  const medical = SALARY_CONSTANTS.MEDICAL_FIXED;
  const special = proRatedBasic * 0.1;
  const overtime = overtimeHours * (basicSalary / (totalWorkingDays * 8)) * 1.5;

  const grossSalary = proRatedBasic + hra + da + ta + medical + special + overtime;

  // Deductions
  const pf = proRatedBasic * SALARY_CONSTANTS.PF_PERCENTAGE;
  const esi =
    grossSalary < SALARY_CONSTANTS.ESI_THRESHOLD
      ? grossSalary * SALARY_CONSTANTS.ESI_PERCENTAGE
      : 0;
  const professionalTax = SALARY_CONSTANTS.PROFESSIONAL_TAX;
  const tax = calculateMonthlyTax(basicSalary * 12);

  const totalDeductions = pf + esi + professionalTax + tax;
  const netSalary = grossSalary - totalDeductions;

  return {
    basicSalary: Math.round(proRatedBasic),
    allowances: {
      hra: Math.round(hra),
      da: Math.round(da),
      ta: Math.round(ta),
      medical: Math.round(medical),
      special: Math.round(special),
      overtime: Math.round(overtime),
    },
    deductions: {
      pf: Math.round(pf),
      esi: Math.round(esi),
      tax: Math.round(tax),
      professionalTax: Math.round(professionalTax),
      loanDeduction: 0,
      other: 0,
    },
    grossSalary: Math.round(grossSalary),
    totalDeductions: Math.round(totalDeductions),
    netSalary: Math.round(netSalary),
  };
}

// Simple monthly tax calculation (new regime)
function calculateMonthlyTax(annualIncome: number): number {
  let tax = 0;
  if (annualIncome <= 300000) tax = 0;
  else if (annualIncome <= 600000) tax = (annualIncome - 300000) * 0.05;
  else if (annualIncome <= 900000) tax = 15000 + (annualIncome - 600000) * 0.1;
  else if (annualIncome <= 1200000) tax = 45000 + (annualIncome - 900000) * 0.15;
  else if (annualIncome <= 1500000) tax = 90000 + (annualIncome - 1200000) * 0.2;
  else tax = 150000 + (annualIncome - 1500000) * 0.3;

  // Add 4% cess
  tax = tax * 1.04;
  // Return monthly
  return tax / 12;
}

// ===================== FASTAPI INTEGRATION =====================

// Calculate salary via FastAPI (if available)
export async function calculateSalaryAPI(
  request: SalaryCalculationRequest
): Promise<ReturnType<typeof calculateSalaryLocal>> {
  try {
    const response = await fetch(`${API_URL}/calculate-salary`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("API unavailable");
    return await response.json();
  } catch {
    // Fallback to local calculation
    return calculateSalaryLocal(request);
  }
}

// Calculate tax via FastAPI (if available)
export async function calculateTaxAPI(
  request: TaxCalculationRequest
): Promise<{ annualTax: number; monthlyTax: number }> {
  try {
    const response = await fetch(`${API_URL}/calculate-tax`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!response.ok) throw new Error("API unavailable");
    return await response.json();
  } catch {
    // Fallback
    const monthlyTax = calculateMonthlyTax(request.annualIncome);
    return { annualTax: monthlyTax * 12, monthlyTax };
  }
}
