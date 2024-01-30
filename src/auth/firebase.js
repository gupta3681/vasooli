// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApyQDyyG6ruY9P-CeCAWzu2c2tEtHrzGU",
  authDomain: "vasooli-373f4.firebaseapp.com",
  projectId: "vasooli-373f4",
  storageBucket: "vasooli-373f4.appspot.com",
  messagingSenderId: "111039382802",
  appId: "1:111039382802:web:6aceadce494a0d766a1fcb",
  measurementId: "G-FWB5LF6GWV",
};

const app = initializeApp(firebaseConfig);

// Get a reference to the auth service
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
