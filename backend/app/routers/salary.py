# ============================================================
# ROUTER: Salary — /calculate-salary endpoint
# ============================================================

from fastapi import APIRouter
from app.models.salary import SalaryRequest, SalaryResponse
from app.services.salary_calculator import calculate_salary

router = APIRouter()


@router.post("", response_model=SalaryResponse)
def compute_salary(request: SalaryRequest):
    """
    Calculate salary breakdown for an employee.

    Computes pro-rated basic, allowances, deductions, and net pay
    based on working days and attendance.
    """
    result = calculate_salary(
        basic_salary=request.basicSalary,
        total_working_days=request.totalWorkingDays,
        days_worked=request.daysWorked,
        overtime_hours=request.overtimeHours,
    )
    return result
