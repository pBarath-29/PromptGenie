import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZLjrivFyueziS54_GG6m2R1G8BP6GhKA",
  authDomain: "prompter-5b0d0.firebaseapp.com",
  databaseURL: "https://prompter-5b0d0-default-rtdb.firebaseio.com",
  projectId: "prompter-5b0d0",
  storageBucket: "prompter-5b0d0.firebasestorage.app",
  messagingSenderId: "877415759939",
  appId: "1:877415759939:web:a5d378bd6618c79a5d14f6",
  measurementId: "G-L0XZN2LV8J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
