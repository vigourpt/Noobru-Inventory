import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDScG9RIIFvOSMgT4YthdV3UD-khybA6Cs",
  authDomain: "noobru-inventory.firebaseapp.com",
  projectId: "noobru-inventory",
  storageBucket: "noobru-inventory.appspot.com",
  messagingSenderId: "679613765573",
  appId: "1:679613765573:web:c5aefd9a7c6d52fa45dac",
  measurementId: "G-8TNILW3DVY",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Firestore collections
export const collections = {
  users: collection(db, "users"),
  inventory: collection(db, "inventory"),
  movements: collection(db, "movements"),
};
