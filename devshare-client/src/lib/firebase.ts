import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const facebookProvider = new FacebookAuthProvider();
facebookProvider.setCustomParameters({ display: "popup" });

export interface SocialAuthResult {
  email: string;
  name: string;
  avatar?: string;
  provider: "google" | "facebook";
  idToken?: string;
  uid: string;
}

export async function signInWithSocial(
  providerType: "google" | "facebook"
): Promise<SocialAuthResult> {
  let provider;
  if (providerType === "google") {
    provider = googleProvider;
  } else if (providerType === "facebook") {
    provider = facebookProvider;
  } else {
    throw new Error(`Unsupported provider: ${providerType}`);
  }

  const credential = await signInWithPopup(auth, provider);
  const user = credential.user;

  if (!user.email) {
    throw new Error(
      "Your social account does not have an email address associated with it."
    );
  }

  const idToken = await user.getIdToken();

  return {
    email: user.email,
    name: user.displayName || user.email.split("@")[0] || "Developer",
    avatar: user.photoURL || undefined,
    provider: providerType,
    idToken,
    uid: user.uid,
  };
}
