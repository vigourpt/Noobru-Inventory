import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5cG9RIIFvOSMgT4YthdV3UD-khybA6Cs",
  authDomain: "noobru-inventory.firebaseapp.com",
  projectId: "noobru-inventory",
  storageBucket: "noobru-inventory.appspot.com",
  messagingSenderId: "679613765573",
  appId: "1:679613765573:web:c5aefd9a7c6d52fa45dac5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firestore collections
export const collections = {
  users: collection(db, "users"),
  inventory: collection(db, "inventory"),
  movements: collection(db, "movements"),
};
