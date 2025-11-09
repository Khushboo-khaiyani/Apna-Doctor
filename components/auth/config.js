
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAYHM0oxXhjjwF75YLm_7Icm5SyVQy7ouw",
    authDomain: "apna-doctor-f1d1a.firebaseapp.com",
    projectId: "apna-doctor-f1d1a",
    storageBucket: "apna-doctor-f1d1a.firebasestorage.app",
    messagingSenderId: "1052883636245",
    appId: "1:1052883636245:web:39af6f6c6447891b507e1c",
    measurementId: "G-QQ09F4D1D6"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);