import { auth, db } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

async function setupAdmin() {
  try {
    // Sign in with the existing account
    const userCred = await signInWithEmailAndPassword(
      auth,
      "dan@noobru.com",
      "NoobruGG25-00!",
    );

    // Set up the admin user document
    await setDoc(
      doc(db, "users", userCred.user.uid),
      {
        email: "dan@noobru.com",
        role: "admin",
        approved: true,
        createdAt: new Date().toISOString(),
      },
      { merge: true },
    ); // merge: true will update existing document or create if doesn't exist

    console.log("Admin user set up successfully");
  } catch (error) {
    console.error("Error setting up admin user:", error);
  }
}

setupAdmin();
