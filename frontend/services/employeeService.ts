// ============================================================
// SERVICE: Employee — Firebase CRUD for employees collection
// Part of the Service Layer (MVVM)
// ============================================================

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Employee, EmployeeFormData } from "@/models/Employee";
import { COLLECTIONS } from "@/config/constants";

const employeesRef = collection(db, COLLECTIONS.EMPLOYEES);

// Generate a unique employee ID (e.g., EMP-001)
async function generateEmployeeId(): Promise<string> {
  const snapshot = await getDocs(employeesRef);
  const nextNum = snapshot.size + 1;
  return `EMP-${String(nextNum).padStart(3, "0")}`;
}

// Get all employees
export async function getAllEmployees(): Promise<Employee[]> {
  const q = query(employeesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    dateOfJoining: doc.data().dateOfJoining?.toDate?.() || new Date(doc.data().dateOfJoining),
    dateOfBirth: doc.data().dateOfBirth?.toDate?.() || new Date(doc.data().dateOfBirth),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
  })) as Employee[];
}

// Get a single employee by ID
export async function getEmployeeById(id: string): Promise<Employee | null> {
  const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    dateOfJoining: data.dateOfJoining?.toDate?.() || new Date(data.dateOfJoining),
    dateOfBirth: data.dateOfBirth?.toDate?.() || new Date(data.dateOfBirth),
    createdAt: data.createdAt?.toDate?.() || new Date(),
    updatedAt: data.updatedAt?.toDate?.() || new Date(),
  } as Employee;
}

// Get employees by department
export async function getEmployeesByDepartment(
  department: string
): Promise<Employee[]> {
  const q = query(employeesRef, where("department", "==", department));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Employee[];
}

// Create a new employee
export async function createEmployee(
  data: EmployeeFormData
): Promise<string> {
  const employeeId = await generateEmployeeId();
  const now = new Date();

  const newEmployee = {
    employeeId,
    ...data,
    dateOfJoining: Timestamp.fromDate(new Date(data.dateOfJoining)),
    dateOfBirth: Timestamp.fromDate(new Date(data.dateOfBirth)),
    status: "active",
    createdAt: Timestamp.fromDate(now),
    updatedAt: Timestamp.fromDate(now),
  };

  const docRef = await addDoc(employeesRef, newEmployee);
  return docRef.id;
}

// Update an employee
export async function updateEmployee(
  id: string,
  data: Partial<EmployeeFormData>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

// Delete an employee (soft delete — set status to terminated)
export async function deleteEmployee(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
  await updateDoc(docRef, {
    status: "terminated",
    updatedAt: Timestamp.fromDate(new Date()),
  });
}

// Hard delete (permanently remove)
export async function permanentlyDeleteEmployee(id: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.EMPLOYEES, id);
  await deleteDoc(docRef);
}

// Get count of active employees
export async function getActiveEmployeeCount(): Promise<number> {
  const q = query(employeesRef, where("status", "==", "active"));
  const snapshot = await getDocs(q);
  return snapshot.size;
}
