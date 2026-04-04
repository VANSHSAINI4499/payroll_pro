// ============================================================
// SERVICE: Auth — Firebase Authentication operations
// Part of the Service Layer (MVVM)
// ============================================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/config/firebase";
import { User } from "@/models/User";
import { COLLECTIONS } from "@/config/constants";

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getDoc(
    doc(db, COLLECTIONS.USERS, credential.user.uid)
  );

  const user: User = userDoc.exists()
    ? (userDoc.data() as User)
    : {
        uid: credential.user.uid,
        email: credential.user.email || email,
        displayName: credential.user.displayName || "Admin",
        role: "admin",
        photoURL: credential.user.photoURL || null,
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

  // Update/create user doc in background — don't block login
  setDoc(
    doc(db, COLLECTIONS.USERS, credential.user.uid),
    { ...user, lastLoginAt: new Date() },
    { merge: true }
  ).catch(() => {});

  return user;
}

// Sign out
export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Sign up / Register a new admin user
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName });

  const newUser: User = {
    uid: credential.user.uid,
    email: credential.user.email || email,
    displayName,
    role: "admin",
    photoURL: null,
    createdAt: new Date(),
    lastLoginAt: new Date(),
  };
  await setDoc(doc(db, COLLECTIONS.USERS, credential.user.uid), newUser);
  return newUser;
}

// Listen to auth state changes
export function onAuthChange(
  callback: (user: FirebaseUser | null) => void
): () => void {
  return onAuthStateChanged(auth, callback);
}

// Get current user profile from Firestore
// Falls back to basic profile from Firebase Auth if Firestore doc doesn't exist yet
export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
  } catch {
    // Firestore might be temporarily unavailable — fall through to fallback
  }

  // Fallback: build profile from Firebase Auth current user
  const currentUser = auth.currentUser;
  if (currentUser && currentUser.uid === uid) {
    return {
      uid: currentUser.uid,
      email: currentUser.email || "",
      displayName: currentUser.displayName || "Admin",
      role: "admin",
      photoURL: currentUser.photoURL || null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
  }

  return null;
}
