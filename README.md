# PayrollPro — Payroll Management System

A full-stack Payroll Management System built with **MVVM architecture**, featuring a **Next.js 14** frontend with **Three.js 3D visualization** and a **Python FastAPI** backend for salary and tax calculations.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|--------------------------------------------------|
| Frontend   | Next.js 14 (App Router), React 18, TypeScript   |
| Styling    | Tailwind CSS with dark mode                      |
| State      | Zustand (MVVM ViewModels)                        |
| 3D         | Three.js + React Three Fiber                     |
| Database   | Firebase Firestore                               |
| Auth       | Firebase Authentication                          |
| Backend    | Python FastAPI (salary & tax microservice)       |

---

## MVVM Architecture

```
Views (UI)  →  ViewModels (Zustand)  →  Services (Firebase/API)  →  Models (TypeScript)
```

- **Models** — TypeScript interfaces for data structures
- **Services** — Firebase CRUD operations and API calls
- **ViewModels** — Zustand stores holding state and business logic
- **Views** — React components (UI only, no business logic)

---

## Project Structure

```
payroll-management-system/
├── frontend/
│   ├── app/                      # Next.js App Router pages
│   │   ├── (dashboard)/          # Protected dashboard routes
│   │   │   ├── employees/
│   │   │   ├── attendance/
│   │   │   ├── payroll/
│   │   │   └── payslips/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── layout/               # Sidebar, Header, DashboardLayout
│   │   ├── three/                # 3D Dashboard scene
│   │   └── ui/                   # Reusable components (Button, Input, etc.)
│   ├── config/
│   │   ├── firebase.ts           # Firebase initialization
│   │   └── constants.ts          # App constants, salary rates
│   ├── models/                   # TypeScript interfaces
│   ├── services/                 # Firebase & API service layer
│   ├── utils/                    # Formatters, helpers
│   └── viewmodels/               # Zustand state stores
├── backend/
│   ├── main.py                   # FastAPI entry point
│   ├── requirements.txt
│   └── app/
│       ├── models/               # Pydantic request/response models
│       ├── services/             # Salary & tax calculators
│       └── routers/              # API route handlers
└── docs/
    ├── SRS.txt                   # Software Requirements Specification
    ├── ER_Diagram.txt            # Entity-Relationship Diagram
    ├── Class_Diagram.txt         # MVVM Class Diagram
    ├── Test_Cases.txt            # Test Cases for all modules
    └── Maintenance_Plan.txt      # Maintenance & support plan
```

---

## Prerequisites

- **Node.js** 18+ and npm 9+
- **Python** 3.10+
- **Firebase** project with Firestore and Authentication enabled

---

## Getting Started

### 1. Clone & Navigate

```bash
cd payroll-management-system
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
```

Edit `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at **http://localhost:3000**

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

Backend runs at **http://localhost:8000**

API docs available at **http://localhost:8000/docs** (Swagger UI)

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Email/Password provider
4. Enable **Cloud Firestore** in production mode
5. Create an admin user in Authentication
6. Copy project config to `.env.local`

### Firestore Security Rules (recommended)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Modules

| Module               | Description                                              |
|----------------------|----------------------------------------------------------|
| **Employee**         | Add, edit, search, filter, terminate employees           |
| **Attendance**       | Mark daily attendance, track hours, overtime              |
| **Payroll**          | Process salary with allowances/deductions, approve, pay  |
| **Tax Calculation**  | Indian tax slabs (old/new regime), 80C/80D deductions    |
| **Payslip**          | Generate and view payslips from processed payrolls       |
| **Dashboard**        | Stats overview with 3D bar visualization (Three.js)      |

---

## API Endpoints (FastAPI)

| Method | Endpoint            | Description                        |
|--------|---------------------|------------------------------------|
| GET    | `/health`           | Health check                       |
| POST   | `/api/salary/calculate-salary` | Calculate salary breakdown |
| POST   | `/api/tax/calculate-tax`       | Calculate tax (old/new regime) |

---

## Salary Constants

| Component           | Rate/Value           |
|---------------------|----------------------|
| HRA                 | 40% of Basic         |
| DA                  | 12% of Basic         |
| Medical Allowance   | ₹1,250/month         |
| Conveyance          | ₹1,600/month         |
| PF (Employee)       | 12% of Basic         |
| PF (Employer)       | 12% of Basic         |
| ESI Threshold       | ₹21,000 gross        |
| ESI Rate            | 0.75%                |
| Professional Tax    | ₹200/month           |

---

## Scripts

```bash
# Frontend
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint

# Backend
uvicorn main:app --reload          # Dev server with auto-reload
uvicorn main:app --host 0.0.0.0   # Production
```

---

## Dark Mode

Toggle dark mode using the sun/moon icon in the header. Preference is saved to localStorage and persists across sessions.

---

## Documentation

All project documents are in the `/docs` folder:

- **SRS.txt** — Full software requirements specification
- **ER_Diagram.txt** — Entity-relationship diagram with schemas
- **Class_Diagram.txt** — MVVM class hierarchy
- **Test_Cases.txt** — Test cases for all modules
- **Maintenance_Plan.txt** — Maintenance, backup, and support plan

---

## License

This project is developed for educational and internal use.
