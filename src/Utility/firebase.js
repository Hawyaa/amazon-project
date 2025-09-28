// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZc8ZfSdNcwlwFYcW3_c-p2Y762zkaxe4",
  authDomain: "project-aaec9.firebaseapp.com",
  projectId: "project-aaec9",
  storageBucket: "project-aaec9.firebasestorage.app",
  messagingSenderId: "218765139207",
  appId: "1:218765139207:web:59341d922eff273a62f9a2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);