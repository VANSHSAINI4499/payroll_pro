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

  if (!userDoc.exists()) {
    // Create user document on first login
    const newUser: User = {
      uid: credential.user.uid,
      email: credential.user.email || email,
      displayName: credential.user.displayName || "Admin",
      role: "admin",
      photoURL: credential.user.photoURL || null,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
    await setDoc(doc(db, COLLECTIONS.USERS, credential.user.uid), newUser);
    return newUser;
  }

  // Update last login
  await setDoc(
    doc(db, COLLECTIONS.USERS, credential.user.uid),
    { lastLoginAt: new Date() },
    { merge: true }
  );

  return userDoc.data() as User;
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
export async function getUserProfile(uid: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
  return userDoc.exists() ? (userDoc.data() as User) : null;
}
