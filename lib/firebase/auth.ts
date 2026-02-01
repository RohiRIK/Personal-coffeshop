import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./index";
import type { User } from "./types";

const USERS_COLLECTION = "users";
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with email and password
 */
export async function signIn(
  email: string,
  password: string,
): Promise<User | null> {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = await getUser(userCredential.user.uid);
    return user;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  displayName?: string,
): Promise<User | null> {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Create user document in Firestore
    const userData: Omit<User, "uid"> = {
      email,
      displayName: displayName || email.split("@")[0],
      role: "guest",
      orderCount: 0,
      createdAt: new Date(),
    };

    await setDoc(doc(db, USERS_COLLECTION, userCredential.user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
    });

    return {
      uid: userCredential.user.uid,
      ...userData,
    };
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const firebaseUser = result.user;

    // Check if user exists in Firestore
    let user = await getUser(firebaseUser.uid);

    // If not, create user document
    if (!user) {
      const userData: Omit<User, "uid"> = {
        email: firebaseUser.email || "",
        displayName:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "User",
        role: "guest",
        orderCount: 0,
        createdAt: new Date(),
      };

      await setDoc(doc(db, USERS_COLLECTION, firebaseUser.uid), {
        ...userData,
        createdAt: serverTimestamp(),
      });

      user = { uid: firebaseUser.uid, ...userData };
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

/**
 * Get user data from Firestore
 */
export async function getUser(uid: string): Promise<User | null> {
  try {
    const docRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
      } as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user:", error);
    return null;
  }
}

/**
 * Get current Firebase auth user
 */
export function getCurrentAuthUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
