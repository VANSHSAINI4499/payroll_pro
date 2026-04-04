// ============================================================
// SERVICE: Attendance — Firebase CRUD for attendance records
// Part of the Service Layer (MVVM)
// ============================================================

import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { Attendance, AttendanceFormData, AttendanceSummary } from "@/models/Attendance";
import { COLLECTIONS } from "@/config/constants";

const attendanceRef = collection(db, COLLECTIONS.ATTENDANCE);

// Get all attendance records
export async function getAllAttendance(): Promise<Attendance[]> {
  const q = query(attendanceRef, orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.() || new Date(doc.data().date),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  })) as Attendance[];
}

// Get attendance for a specific employee
export async function getAttendanceByEmployee(
  employeeId: string
): Promise<Attendance[]> {
  const q = query(
    attendanceRef,
    where("employeeId", "==", employeeId),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.() || new Date(doc.data().date),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  })) as Attendance[];
}

// Get attendance for a specific month
export async function getAttendanceByMonth(
  month: number,
  year: number
): Promise<Attendance[]> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  const q = query(
    attendanceRef,
    where("date", ">=", Timestamp.fromDate(startDate)),
    where("date", "<=", Timestamp.fromDate(endDate)),
    orderBy("date", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate?.() || new Date(doc.data().date),
    createdAt: doc.data().createdAt?.toDate?.() || new Date(),
  })) as Attendance[];
}

// Create an attendance record
export async function createAttendance(
  data: AttendanceFormData
): Promise<string> {
  // Calculate hours worked
  const [inH, inM] = data.checkIn.split(":").map(Number);
  const [outH, outM] = data.checkOut.split(":").map(Number);
  const hoursWorked = Math.max(0, outH + outM / 60 - (inH + inM / 60));
  const overtime = Math.max(0, hoursWorked - 8);

  const record = {
    ...data,
    date: Timestamp.fromDate(new Date(data.date)),
    hoursWorked: Math.round(hoursWorked * 100) / 100,
    overtime: Math.round(overtime * 100) / 100,
    createdAt: Timestamp.fromDate(new Date()),
  };

  const docRef = await addDoc(attendanceRef, record);
  return docRef.id;
}

// Update an attendance record
export async function updateAttendance(
  id: string,
  data: Partial<AttendanceFormData>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.ATTENDANCE, id);
  await updateDoc(docRef, { ...data });
}

// Get attendance summary for an employee for a specific month
export async function getAttendanceSummary(
  employeeId: string,
  employeeName: string,
  month: number,
  year: number
): Promise<AttendanceSummary> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);

  const q = query(
    attendanceRef,
    where("employeeId", "==", employeeId),
    where("date", ">=", Timestamp.fromDate(startDate)),
    where("date", "<=", Timestamp.fromDate(endDate))
  );

  const snapshot = await getDocs(q);
  const records = snapshot.docs.map((d) => d.data());

  return {
    employeeId,
    employeeName,
    month,
    year,
    totalPresent: records.filter((r) => r.status === "present").length,
    totalAbsent: records.filter((r) => r.status === "absent").length,
    totalLeaves: records.filter((r) => r.status === "leave").length,
    totalHalfDays: records.filter((r) => r.status === "half-day").length,
    totalHoursWorked: records.reduce((sum, r) => sum + (r.hoursWorked || 0), 0),
    totalOvertime: records.reduce((sum, r) => sum + (r.overtime || 0), 0),
  };
}
