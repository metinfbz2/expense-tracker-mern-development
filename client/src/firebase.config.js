// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9ZNUXGbfjWJaODNPwbOSrbSzVGRExZx8",
  authDomain: "myexpenses-692cf.firebaseapp.com",
  projectId: "myexpenses-692cf",
  storageBucket: "myexpenses-692cf.appspot.com",
  messagingSenderId: "754117962903",
  appId: "1:754117962903:web:4161dc30caf72c09f0cdd2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()