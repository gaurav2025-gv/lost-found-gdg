import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "./config";

export { auth };

const provider = new GoogleAuthProvider();

export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("Login Success:", result.user);
    return result;
  } catch (error) {
    console.error("Login Failed:", error);
    alert(`Login Failed: ${error.message}\nCode: ${error.code}`);
    throw error;
  }
};

export const googleLogout = async () => {
  try {
    await signOut(auth);
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout Failed:", error);
    alert(`Logout Failed: ${error.message}`);
    throw error;
  }
};
