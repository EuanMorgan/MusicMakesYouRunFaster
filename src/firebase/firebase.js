import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
});

export const auth = app.auth();
export const db = app.firestore();
export const firebaseApp = app;
export default app;
