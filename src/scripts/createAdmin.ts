import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

async function createAdminUser() {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      "dan@noobru.com",
      "NoobruGG25-00!",
    );

    await setDoc(doc(db, "users", userCred.user.uid), {
      email: "dan@noobru.com",
      approved: true,
      role: "admin",
      createdAt: new Date().toISOString(),
    });

    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdminUser();
