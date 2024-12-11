import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCU4ZJSLa3MLZrMbQN2866pIZ-TuKk_evo",
  authDomain: "astro-archive-9fb7e.firebaseapp.com",
  projectId: "astro-archive-9fb7e",
  storageBucket: "astro-archive-9fb7e.firebasestorage.app",
  messagingSenderId: "586068510330",
  appId: "1:586068510330:web:f5793fa2a143e84ae6ddc3",
  measurementId: "G-VCPK5EF2L6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

export { app, auth };