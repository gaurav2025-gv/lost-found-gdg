import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export async function addItem(type, data) {
  await addDoc(collection(db, "items"), {
    type,                 // "lost" | "found"
    status: "OPEN",       // OPEN | RESOLVED
    createdAt: serverTimestamp(),
    ...data,
  });
}
