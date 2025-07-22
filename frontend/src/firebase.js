// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_6YEdYkS1yCk-tUrCPtPbO0XAB7tZD4g",
  authDomain: "ai-resume-evaluator-b7b3d.firebaseapp.com",
  projectId: "ai-resume-evaluator-b7b3d",
  storageBucket: "ai-resume-evaluator-b7b3d.appspot.com",
  messagingSenderId: "765734878167",
  appId: "1:765734878167:web:8bc9b0cacbf7e851c92992",
  measurementId: "G-458GZZ30M0",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);







