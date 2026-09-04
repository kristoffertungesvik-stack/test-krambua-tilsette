/**
 * Firebase client setup.
 *
 * The app is a fully static export (GitHub Pages), so this is the browser
 * SDK talking directly to Firestore — there is no server component. Every
 * visitor authenticates anonymously (invisible, no extra login step) so
 * that Firestore's security rules can require `request.auth != null` and
 * reject requests from anyone who hasn't loaded the app itself.
 *
 * The values below (including apiKey) are not secrets — Firebase web
 * config is meant to be public; access is controlled by the Firestore
 * security rules, not by hiding this file. See firestore.rules.
 */
import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { type Firestore, getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDK2THiSssAXfWJMiIYs28k3S7yZGcTbZk",
  authDomain: "krambua-tilsette.firebaseapp.com",
  projectId: "krambua-tilsette",
  storageBucket: "krambua-tilsette.firebasestorage.app",
  messagingSenderId: "39805752755",
  appId: "1:39805752755:web:8b67b39213323d4187e7c6",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function ensureApp() {
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
  return { app, auth: auth!, db: db! };
}

/** Firestore instance. Only call this in the browser. */
export function getDb(): Firestore {
  return ensureApp().db;
}

/**
 * Resolves once this browser has a signed-in (anonymous) Firebase user,
 * signing in if needed. Safe to call more than once.
 */
export function ensureAnonAuth(): Promise<void> {
  const { auth: a } = ensureApp();
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(a, (user) => {
      if (user) {
        unsubscribe();
        resolve();
        return;
      }
      signInAnonymously(a).catch((err) => {
        console.error("Anonym innlogging mot Firebase feila", err);
        unsubscribe();
        resolve();
      });
    });
  });
}
