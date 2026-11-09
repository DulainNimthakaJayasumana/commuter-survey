// Paste your Firebase web app config here.
// Firebase console → Project settings → General → "Your apps" → Web app → SDK setup and configuration → Config.
// (These values are not secrets; access is controlled by firestore.rules.)
//
// While apiKey still starts with "YOUR_", the survey runs in DEMO MODE:
// responses are only printed to the browser console, nothing is saved.

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

export const COLLECTION = "responses";
