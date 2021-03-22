const firebase = require("firebase");
console.log(process.env);
const firebaseApp = firebase.default.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
});

const db = firebase.default.firestore();

module.exports = { firebaseApp, db };
