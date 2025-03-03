import { auth, db } from "../lib/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

async function initializeFirestore() {
  try {
    // Create collections by adding a dummy document (will be overwritten later)
    const collections = ["users", "inventory", "movements"];

    for (const collectionName of collections) {
      const collectionRef = collection(db, collectionName);
      const dummyDocRef = doc(collectionRef, "initial-setup");
      await setDoc(dummyDocRef, {
        _created: new Date().toISOString(),
        _description: `Initial setup document for ${collectionName} collection`,
      });
      console.log(`Created ${collectionName} collection`);
    }

    console.log("Firestore collections initialized successfully");
  } catch (error) {
    console.error("Error initializing Firestore:", error);
  }
}

initializeFirestore();
