"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "lib/firebase";
import {
  getUser,
  signIn,
  signUp,
  signOut,
  signInWithGoogle,
} from "lib/firebase/auth";
import type { User } from "lib/firebase/types";

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User | null>;
  signUp: (
    email: string,
    password: string,
    displayName?: string,
  ) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const userData = await getUser(fbUser.uid);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    const userData = await signIn(email, password);
    setUser(userData);
    return userData;
  };

  const handleSignUp = async (
    email: string,
    password: string,
    displayName?: string,
  ) => {
    const userData = await signUp(email, password, displayName);
    setUser(userData);
    return userData;
  };

  const handleSignInWithGoogle = async () => {
    const userData = await signInWithGoogle();
    setUser(userData);
    return userData;
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
