// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxnHt3H5eT2cAmQah7ztVfRyeDGqFUgNo",
  authDomain: "sensolink-bed71.firebaseapp.com",
  projectId: "sensolink-bed71",
  storageBucket: "sensolink-bed71.firebasestorage.app",
  messagingSenderId: "293062615573",
  appId: "1:293062615573:web:cbc13b3745feae4188241c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app)

export {auth, db};