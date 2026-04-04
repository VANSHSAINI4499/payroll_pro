// ============================================================
// VIEW: Employees — Employee management panel
// UI Layer (MVVM - View) — NO business logic here
// All state/logic delegated to useEmployeeViewModel
// ============================================================

"use client";

import React, { useEffect, useState } from "react";
import { HiPlus, HiSearch, HiPencil, HiTrash } from "react-icons/hi";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import DataTable from "@/components/ui/DataTable";
import { useEmployeeViewModel } from "@/viewmodels/useEmployeeViewModel";
import { Employee, EmployeeFormData, Department } from "@/models/Employee";
import { DEPARTMENTS } from "@/config/constants";
import { formatDate, formatCurrency } from "@/utils/helpers";

// Default form values
const defaultForm: EmployeeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "engineering",
  designation: "",
  dateOfJoining: "",
  dateOfBirth: "",
  gender: "male",
  address: { street: "", city: "", state: "", zipCode: "", country: "India" },
  bankDetails: { bankName: "", accountNumber: "", ifscCode: "", accountHolderName: "" },
  basicSalary: 0,
};

export default function EmployeeView() {
  const {
    isLoading,
    fetchEmployees,
    addEmployee,
    editEmployee,
    removeEmployee,
    getFilteredEmployees,
    searchQuery,
    setSearchQuery,
    filterDepartment,
    setFilterDepartment,
    filterStatus,
    setFilterStatus,
  } = useEmployeeViewModel();

  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [form, setForm] = useState<EmployeeFormData>(defaultForm);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const filteredEmployees = getFilteredEmployees();

  // Open add modal
  const handleAdd = () => {
    setEditingEmployee(null);
    setForm(defaultForm);
    setShowModal(true);
  };

  // Open edit modal
  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation,
      dateOfJoining: emp.dateOfJoining instanceof Date
        ? emp.dateOfJoining.toISOString().split("T")[0]
        : String(emp.dateOfJoining),
      dateOfBirth: emp.dateOfBirth instanceof Date
        ? emp.dateOfBirth.toISOString().split("T")[0]
        : String(emp.dateOfBirth),
      gender: emp.gender,
      address: emp.address,
      bankDetails: emp.bankDetails,
      basicSalary: emp.basicSalary,
    });
    setShowModal(true);
  };

  // Delete employee
  const handleDelete = async (emp: Employee) => {
    if (!confirm(`Terminate ${emp.firstName} ${emp.lastName}?`)) return;
    try {
      await removeEmployee(emp.id);
      toast.success("Employee terminated");
    } catch {
      toast.error("Failed to terminate employee");
    }
  };

  // Submit form (add or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEmployee) {
        await editEmployee(editingEmployee.id, form);
        toast.success("Employee updated");
      } else {
        await addEmployee(form);
        toast.success("Employee added");
      }
      setShowModal(false);
    } catch {
      toast.error("Operation failed");
    }
  };

  // Update a form field
  const updateForm = (field: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Table columns
  const columns = [
    {
      key: "employeeId",
      header: "ID",
      render: (emp: Employee) => (
        <span className="font-mono text-xs">{emp.employeeId}</span>
      ),
    },
    {
      key: "name",
      header: "Name",
      render: (emp: Employee) => (
        <div>
          <p className="font-medium">{emp.firstName} {emp.lastName}</p>
          <p className="text-xs text-gray-500">{emp.email}</p>
        </div>
      ),
    },
    {
      key: "department",
      header: "Department",
      render: (emp: Employee) => (
        <span className="capitalize">{emp.department}</span>
      ),
    },
    { key: "designation", header: "Designation" },
    {
      key: "basicSalary",
      header: "Basic Salary",
      render: (emp: Employee) => formatCurrency(emp.basicSalary),
    },
    {
      key: "dateOfJoining",
      header: "Joined",
      render: (emp: Employee) => formatDate(emp.dateOfJoining),
    },
    {
      key: "status",
      header: "Status",
      render: (emp: Employee) => <Badge status={emp.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      render: (emp: Employee) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(emp); }}
            className="p-1.5 rounded-lg hover:bg-blue-500/10 dark:hover:bg-blue-500/10 transition-colors"
          >
            <HiPencil className="h-4 w-4 text-blue-500" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(emp); }}
            className="p-1.5 rounded-lg hover:bg-red-500/10 dark:hover:bg-red-500/10 transition-colors"
          >
            <HiTrash className="h-4 w-4 text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-header">Employee Management</h1>
          <p className="page-subheader">
            Manage your organization&apos;s employees
          </p>
        </div>
        <Button onClick={handleAdd}>
          <HiPlus className="h-4 w-4 mr-1" />
          Add Employee
        </Button>
      </div>

      {/* Filters */}
      <Card className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <HiSearch className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, ID, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          options={[{ value: "all", label: "All Departments" }, ...DEPARTMENTS.map((d) => ({ value: d.value, label: d.label }))]}
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        />
        <Select
          options={[
            { value: "all", label: "All Status" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "terminated", label: "Terminated" },
          ]}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        />
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={filteredEmployees}
          keyExtractor={(emp) => emp.id}
          isLoading={isLoading}
          emptyMessage="No employees found. Add your first employee!"
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEmployee ? "Edit Employee" : "Add New Employee"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={(e) => updateForm("firstName", e.target.value)}
              required
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={(e) => updateForm("lastName", e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
              required
            />
            <Input
              label="Phone"
              value={form.phone}
              onChange={(e) => updateForm("phone", e.target.value)}
              required
            />
            <Select
              label="Department"
              options={DEPARTMENTS.map((d) => ({ value: d.value, label: d.label }))}
              value={form.department}
              onChange={(e) => updateForm("department", e.target.value as Department)}
            />
            <Input
              label="Designation"
              value={form.designation}
              onChange={(e) => updateForm("designation", e.target.value)}
              required
            />
            <Input
              label="Date of Joining"
              type="date"
              value={form.dateOfJoining}
              onChange={(e) => updateForm("dateOfJoining", e.target.value)}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => updateForm("dateOfBirth", e.target.value)}
              required
            />
            <Select
              label="Gender"
              options={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              value={form.gender}
              onChange={(e) => updateForm("gender", e.target.value)}
            />
            <Input
              label="Basic Salary (₹)"
              type="number"
              value={form.basicSalary || ""}
              onChange={(e) => updateForm("basicSalary", Number(e.target.value))}
              required
            />
          </div>

          {/* Address */}
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-2">
            Address
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Street"
              value={form.address.street}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: { ...p.address, street: e.target.value } }))
              }
            />
            <Input
              label="City"
              value={form.address.city}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: { ...p.address, city: e.target.value } }))
              }
            />
            <Input
              label="State"
              value={form.address.state}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: { ...p.address, state: e.target.value } }))
              }
            />
            <Input
              label="ZIP Code"
              value={form.address.zipCode}
              onChange={(e) =>
                setForm((p) => ({ ...p, address: { ...p.address, zipCode: e.target.value } }))
              }
            />
          </div>

          {/* Bank Details */}
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 pt-2">
            Bank Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Bank Name"
              value={form.bankDetails.bankName}
              onChange={(e) =>
                setForm((p) => ({ ...p, bankDetails: { ...p.bankDetails, bankName: e.target.value } }))
              }
            />
            <Input
              label="Account Number"
              value={form.bankDetails.accountNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, bankDetails: { ...p.bankDetails, accountNumber: e.target.value } }))
              }
            />
            <Input
              label="IFSC Code"
              value={form.bankDetails.ifscCode}
              onChange={(e) =>
                setForm((p) => ({ ...p, bankDetails: { ...p.bankDetails, ifscCode: e.target.value } }))
              }
            />
            <Input
              label="Account Holder Name"
              value={form.bankDetails.accountHolderName}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  bankDetails: { ...p.bankDetails, accountHolderName: e.target.value },
                }))
              }
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-white/10">
            <Button variant="secondary" onClick={() => setShowModal(false)} type="button">
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingEmployee ? "Update Employee" : "Add Employee"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
