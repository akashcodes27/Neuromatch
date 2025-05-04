import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  // paste your config here
  apiKey: "AIzaSyDLe8WIO0RzJw5oK6gfIFGEpRwtjjAs0Nk",
  authDomain: "neuromatch-857f8.firebaseapp.com",
  projectId: "neuromatch-857f8",
  storageBucket: "neuromatch-857f8.firebasestorage.app",
  messagingSenderId: "448717552996",
  appId: "1:448717552996:web:7bcb814fdbbea1e16ece71",
  measurementId: "G-0DEC4F7RTL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); 

export { db, auth };
