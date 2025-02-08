// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8Vz326aiNfcRCquownxyrMjx4xEcGPSk",
  authDomain: "hackathon25-c5115.firebaseapp.com",
  projectId: "hackathon25-c5115",
  storageBucket: "hackathon25-c5115.firebasestorage.app",
  messagingSenderId: "496499801112",
  appId: "1:496499801112:web:a7abf88e7dcf6ed735d76d",
  measurementId: "G-Z6QS26NTSV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, doc, setDoc, getDoc, updateDoc, collection, getDocs };