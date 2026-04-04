# ============================================================
# FastAPI Backend — Main application entry point
# Payroll Management System — Salary & Tax calculation engine
# ============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import salary, tax

app = FastAPI(
    title="PayrollPro API",
    description="Salary and Tax calculation engine for Payroll Management System",
    version="1.0.0",
)

# CORS — Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(salary.router, prefix="/calculate-salary", tags=["Salary"])
app.include_router(tax.router, prefix="/calculate-tax", tags=["Tax"])


@app.get("/")
def root():
    return {"status": "ok", "service": "PayrollPro API", "version": "1.0.0"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
