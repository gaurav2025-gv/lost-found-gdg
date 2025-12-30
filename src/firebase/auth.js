import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export const googleLogin = async () => {
  return await signInWithPopup(auth, provider);
};
