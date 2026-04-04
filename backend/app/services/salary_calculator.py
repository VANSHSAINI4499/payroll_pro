# ============================================================
# SERVICE: Salary Calculator — Core salary computation logic
# Modular and reusable salary calculation engine
# ============================================================

# Salary Constants
HRA_PERCENTAGE = 0.40       # 40% of basic
DA_PERCENTAGE = 0.12        # 12% of basic
TA_FIXED = 1600.0           # Fixed travel allowance
MEDICAL_FIXED = 1250.0      # Fixed medical allowance
SPECIAL_PERCENTAGE = 0.10   # 10% of basic
PF_PERCENTAGE = 0.12        # 12% employee PF
ESI_PERCENTAGE = 0.0075     # 0.75% of gross
PROFESSIONAL_TAX = 200.0    # Fixed monthly
ESI_THRESHOLD = 21000.0     # ESI applicable below this gross
OVERTIME_MULTIPLIER = 1.5   # Overtime rate multiplier


def calculate_salary(
    basic_salary: float,
    total_working_days: int,
    days_worked: int,
    overtime_hours: float = 0.0,
) -> dict:
    """
    Calculate complete salary breakdown.

    Args:
        basic_salary: Monthly basic salary
        total_working_days: Total working days in the month
        days_worked: Actual days worked
        overtime_hours: Total overtime hours

    Returns:
        Dictionary with full salary breakdown
    """
    # Pro-rate basic salary based on attendance
    pro_rated_basic = (basic_salary / total_working_days) * days_worked

    # === Allowances ===
    hra = pro_rated_basic * HRA_PERCENTAGE
    da = pro_rated_basic * DA_PERCENTAGE
    ta = TA_FIXED
    medical = MEDICAL_FIXED
    special = pro_rated_basic * SPECIAL_PERCENTAGE

    # Overtime pay: hourly rate * 1.5
    hourly_rate = basic_salary / (total_working_days * 8)
    overtime_pay = overtime_hours * hourly_rate * OVERTIME_MULTIPLIER

    gross_salary = pro_rated_basic + hra + da + ta + medical + special + overtime_pay

    # === Deductions ===
    pf = pro_rated_basic * PF_PERCENTAGE
    esi = gross_salary * ESI_PERCENTAGE if gross_salary < ESI_THRESHOLD else 0.0
    professional_tax = PROFESSIONAL_TAX

    # Income tax (monthly estimate using new regime)
    annual_income = basic_salary * 12
    monthly_tax = _calculate_monthly_tax(annual_income)

    total_deductions = pf + esi + professional_tax + monthly_tax
    net_salary = gross_salary - total_deductions

    return {
        "basicSalary": round(pro_rated_basic),
        "allowances": {
            "hra": round(hra),
            "da": round(da),
            "ta": round(ta),
            "medical": round(medical),
            "special": round(special),
            "overtime": round(overtime_pay),
        },
        "deductions": {
            "pf": round(pf),
            "esi": round(esi),
            "tax": round(monthly_tax),
            "professionalTax": round(professional_tax),
            "loanDeduction": 0,
            "other": 0,
        },
        "grossSalary": round(gross_salary),
        "totalDeductions": round(total_deductions),
        "netSalary": round(net_salary),
    }


def _calculate_monthly_tax(annual_income: float) -> float:
    """Calculate monthly income tax using the new tax regime (India)."""
    if annual_income <= 300000:
        tax = 0
    elif annual_income <= 600000:
        tax = (annual_income - 300000) * 0.05
    elif annual_income <= 900000:
        tax = 15000 + (annual_income - 600000) * 0.10
    elif annual_income <= 1200000:
        tax = 45000 + (annual_income - 900000) * 0.15
    elif annual_income <= 1500000:
        tax = 90000 + (annual_income - 1200000) * 0.20
    else:
        tax = 150000 + (annual_income - 1500000) * 0.30

    # Add 4% health & education cess
    tax *= 1.04

    return tax / 12  # monthly
