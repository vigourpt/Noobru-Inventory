import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { AuthContext } from "@/lib/auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [role, setRole] = useState<string>();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setIsApproved(userData?.approved || false);
        setRole(userData?.role || "pending");
      } else {
        setIsApproved(false);
        setRole(undefined);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return userCredential;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return userCredential;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
    isApproved,
    role,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
