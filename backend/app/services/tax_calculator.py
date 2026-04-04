# ============================================================
# SERVICE: Tax Calculator — Income tax computation logic
# Supports both old and new Indian tax regimes
# ============================================================


def calculate_tax(
    annual_income: float,
    regime: str = "new",
    investments: dict | None = None,
) -> dict:
    """
    Calculate income tax based on regime.

    Args:
        annual_income: Total annual income
        regime: "old" or "new" tax regime
        investments: Deduction details for old regime

    Returns:
        Full tax breakdown
    """
    if regime == "old":
        return _calculate_old_regime(annual_income, investments or {})
    return _calculate_new_regime(annual_income)


def _calculate_new_regime(annual_income: float) -> dict:
    """New Tax Regime (FY 2024-25) — No deductions, lower rates."""
    slabs = [
        (300000, 0.00),
        (300000, 0.05),   # 3L - 6L
        (300000, 0.10),   # 6L - 9L
        (300000, 0.15),   # 9L - 12L
        (300000, 0.20),   # 12L - 15L
        (float("inf"), 0.30),  # > 15L
    ]

    breakdown = []
    taxable = annual_income
    total_tax = 0.0
    lower = 0

    for limit, rate in slabs:
        if taxable <= 0:
            break
        slab_amount = min(taxable, limit)
        slab_tax = slab_amount * rate
        total_tax += slab_tax
        taxable -= slab_amount

        upper = lower + limit if limit != float("inf") else None
        breakdown.append({
            "slab": f"₹{lower:,.0f} - {'above' if upper is None else f'₹{upper:,.0f}'}",
            "rate": f"{rate * 100:.0f}%",
            "taxableAmount": round(slab_amount),
            "tax": round(slab_tax),
        })
        lower += limit

    # 4% Health & Education Cess
    cess = total_tax * 0.04
    total_tax_with_cess = total_tax + cess

    return {
        "annualTax": round(total_tax_with_cess),
        "monthlyTax": round(total_tax_with_cess / 12),
        "effectiveRate": round((total_tax_with_cess / annual_income) * 100, 2) if annual_income > 0 else 0,
        "regime": "new",
        "taxableIncome": round(annual_income),
        "breakdown": breakdown,
    }


def _calculate_old_regime(annual_income: float, investments: dict) -> dict:
    """Old Tax Regime — With deductions under 80C, 80D, etc."""
    # Standard deduction
    standard_deduction = 50000

    # Section 80C (max 1.5L)
    sec_80c = min(investments.get("section80C", 0), 150000)
    # Section 80D (max 25000 for self)
    sec_80d = min(investments.get("section80D", 0), 25000)
    # HRA exemption
    hra_exempt = investments.get("hra", 0)
    # Other deductions
    other = investments.get("other", 0)

    total_deductions = standard_deduction + sec_80c + sec_80d + hra_exempt + other
    taxable_income = max(0, annual_income - total_deductions)

    # Old regime slabs
    slabs = [
        (250000, 0.00),
        (250000, 0.05),   # 2.5L - 5L
        (500000, 0.20),   # 5L - 10L
        (float("inf"), 0.30),  # > 10L
    ]

    breakdown = []
    remaining = taxable_income
    total_tax = 0.0
    lower = 0

    for limit, rate in slabs:
        if remaining <= 0:
            break
        slab_amount = min(remaining, limit)
        slab_tax = slab_amount * rate
        total_tax += slab_tax
        remaining -= slab_amount

        upper = lower + limit if limit != float("inf") else None
        breakdown.append({
            "slab": f"₹{lower:,.0f} - {'above' if upper is None else f'₹{upper:,.0f}'}",
            "rate": f"{rate * 100:.0f}%",
            "taxableAmount": round(slab_amount),
            "tax": round(slab_tax),
        })
        lower += limit

    cess = total_tax * 0.04
    total_tax_with_cess = total_tax + cess

    return {
        "annualTax": round(total_tax_with_cess),
        "monthlyTax": round(total_tax_with_cess / 12),
        "effectiveRate": round((total_tax_with_cess / annual_income) * 100, 2) if annual_income > 0 else 0,
        "regime": "old",
        "taxableIncome": round(taxable_income),
        "breakdown": breakdown,
    }
