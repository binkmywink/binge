import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export async function signUp(email, password, displayName) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    await updateProfile(userCredential.user, {
      displayName: displayName,
    });

    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: email,
      displayName: displayName,
      createdAt: new Date().toISOString(),
      profile: {
        name: displayName,
        initials: displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      },
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function login(email, password) {
  try {
    await setPersistence(auth, browserLocalPersistence);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
}

export async function getUserProfile(uid) {
  try {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    throw error;
  }
}

export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}
