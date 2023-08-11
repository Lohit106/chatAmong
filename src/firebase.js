import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDT6NJulHrE47CK5cTLWNX-Gpbx4I53_ak",
  authDomain: "chatamong-ff191.firebaseapp.com",
  projectId: "chatamong-ff191",
  storageBucket: "chatamong-ff191.appspot.com",
  messagingSenderId: "585028148610",
  appId: "1:585028148610:web:2caed62c0c02962945439b"
};

export const app = initializeApp(firebaseConfig);