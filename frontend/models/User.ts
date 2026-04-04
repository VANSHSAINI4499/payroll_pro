// ============================================================
// MODEL: User — Represents an authenticated admin user
// Part of the Data Layer (MVVM - Model)
// ============================================================

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: "admin" | "manager" | "viewer";
  photoURL?: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
