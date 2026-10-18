import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDzv2Hm2DrfJ9GN2xptAUK6mJ5hnwARA4k",
  authDomain: "padmashri-agro.firebaseapp.com",
  projectId: "padmashri-agro",
  storageBucket: "padmashri-agro.firebasestorage.app",
  messagingSenderId: "37199355736",
  appId: "1:37199355736:web:154e6756c4558636940f2d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
