# ============================================================
# MODEL: Salary — Request/Response schemas for salary calculation
# ============================================================

from pydantic import BaseModel


class SalaryRequest(BaseModel):
    employeeId: str
    basicSalary: float
    month: int
    year: int
    totalWorkingDays: int
    daysWorked: int
    overtimeHours: float = 0.0


class Allowances(BaseModel):
    hra: float
    da: float
    ta: float
    medical: float
    special: float
    overtime: float


class Deductions(BaseModel):
    pf: float
    esi: float
    tax: float
    professionalTax: float
    loanDeduction: float = 0.0
    other: float = 0.0


class SalaryResponse(BaseModel):
    basicSalary: float
    allowances: Allowances
    deductions: Deductions
    grossSalary: float
    totalDeductions: float
    netSalary: float
