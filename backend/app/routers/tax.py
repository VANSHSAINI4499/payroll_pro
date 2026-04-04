# ============================================================
# ROUTER: Tax — /calculate-tax endpoint
# ============================================================

from fastapi import APIRouter
from app.models.tax import TaxRequest, TaxResponse
from app.services.tax_calculator import calculate_tax

router = APIRouter()


@router.post("", response_model=TaxResponse)
def compute_tax(request: TaxRequest):
    """
    Calculate income tax based on the selected regime.

    Supports both old and new Indian tax regimes with
    slab-wise breakdown and cess computation.
    """
    investments = None
    if request.investments:
        investments = request.investments.model_dump()

    result = calculate_tax(
        annual_income=request.annualIncome,
        regime=request.regime,
        investments=investments,
    )
    return result
