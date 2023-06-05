import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, getFirestore, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getMessaging,deleteToken } from "firebase/messaging"

const firebaseConfig = {
    apiKey: "AIzaSyCV7Wcy6pnemMmARRUc-X9qix0nZRmmdD8",
    authDomain: "test-deb6a.firebaseapp.com",
    projectId: "test-deb6a",
    storageBucket: "test-deb6a.appspot.com",
    messagingSenderId: "702085190161",
    appId: "1:702085190161:web:18b918699d62d0fdd197b0",
    measurementId: "G-10G47C4NT1"
  };


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export const messaging = getMessaging(app);
export default { db, auth };