# ============================================================
# MODEL: Tax — Request/Response schemas for tax calculation
# ============================================================

from pydantic import BaseModel
from typing import Optional


class TaxInvestments(BaseModel):
    section80C: float = 0.0
    section80D: float = 0.0
    hra: float = 0.0
    other: float = 0.0


class TaxRequest(BaseModel):
    annualIncome: float
    regime: str = "new"  # "old" or "new"
    investments: Optional[TaxInvestments] = None


class TaxResponse(BaseModel):
    annualTax: float
    monthlyTax: float
    effectiveRate: float
    regime: str
    taxableIncome: float
    breakdown: list[dict]
