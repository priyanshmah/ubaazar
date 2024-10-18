// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAuTozis23fC8VRUBmnVigPM62YZBsa8k",
  authDomain: "ubazaar-e63aa.firebaseapp.com",
  projectId: "ubazaar-e63aa",
  storageBucket: "ubazaar-e63aa.appspot.com",
  messagingSenderId: "876718986572",
  appId: "1:876718986572:web:21c7aa5799f99bc97c2be9",
  measurementId: "G-Y6XY4H78DS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

auth.settings.appVerificationDisabledForTesting = true;

export { auth }