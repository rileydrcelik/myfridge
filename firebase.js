// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDdgJMTFVzEP8LVeJdKiI-NUqiJwMifJDE",
  authDomain: "inventory-management-62220.firebaseapp.com",
  projectId: "inventory-management-62220",
  storageBucket: "inventory-management-62220.appspot.com",
  messagingSenderId: "591711525607",
  appId: "1:591711525607:web:95fccf1158b773a0d8a042",
  measurementId: "G-MYWFF9YD2L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
