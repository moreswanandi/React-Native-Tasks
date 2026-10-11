// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { initializeAuth } from "firebase/auth/cordova";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZ2UR3C02WY4NZItL19sJJWoc5-FukJfE",
  authDomain: "task-1-db576.firebaseapp.com",
  projectId: "task-1-db576",
  storageBucket: "task-1-db576.firebasestorage.app",
  messagingSenderId: "251257137702",
  appId: "1:251257137702:web:83cac033ada597d7c914e7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//export const auth = getAuth(app);
export const db = getFirestore(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
