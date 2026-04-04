// ============================================================
// VIEWMODEL: Auth — Manages authentication state & logic
// Logic Layer (MVVM - ViewModel)
// Connects Auth Views ↔ Auth Service (Model)
// ============================================================

import { create } from "zustand";
import { AuthState, User } from "@/models/User";
import * as authService from "@/services/authService";

interface AuthViewModel extends AuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuthListener: () => () => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthViewModel = create<AuthViewModel>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Login with email/password
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signIn(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Login failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Sign up new admin
  signup: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signUp(email, password, displayName);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Sign up failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Logout failed";
      set({ error: message, isLoading: false });
    }
  },

  // Initialize Firebase auth state listener
  initAuthListener: () => {
    set({ isLoading: true });
    const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const profile = await authService.getUserProfile(firebaseUser.uid);
          if (profile) {
            set({
              user: profile,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Firestore doc missing but Firebase Auth is valid — use basic profile
            set({
              user: {
                uid: firebaseUser.uid,
                email: firebaseUser.email || "",
                displayName: firebaseUser.displayName || "Admin",
                role: "admin",
                photoURL: firebaseUser.photoURL || null,
                createdAt: new Date(),
                lastLoginAt: new Date(),
              },
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch {
        // On any error, still mark loading as done
        set({ isLoading: false });
      }
    });
    return unsubscribe;
  },

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  clearError: () => set({ error: null }),
}));
