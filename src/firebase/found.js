import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const addFoundItem = async (data) => {
  try {
    const ref = await addDoc(collection(db, "foundItems"), {
      ...data,
      status: "OPEN",
      createdAt: serverTimestamp(),
    });

    // ID return karna zaroori hai taaki resolveCase function chale
    return { id: ref.id, ...data };
  } catch (error) {
    console.error("Error adding found item:", error);
    throw error;
  }
};