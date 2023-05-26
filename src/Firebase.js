// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyDMkVOsbtUCsu8Sycp6wBP_y9oIIeYq7bo",
    authDomain: "fir-demo-478.firebaseapp.com",
    projectId: "fir-demo-478",
    storageBucket: "fir-demo-478.appspot.com",
    messagingSenderId: "712006238008",
    appId: "1:712006238008:web:0a5195cbc263d74d7bcbcd",
    measurementId: "G-YQ7PRMQ4LW"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;
