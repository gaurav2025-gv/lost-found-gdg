import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "./config";

export const deleteAllFoundItems = async () => {
  try {
    // ⚠️ Check karo collection ka naam "foundItems" hi hai ya kuch aur
    const colRef = collection(db, "foundItems");
    const q = query(colRef, where("status", "==", "open"));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log("No open found items to delete.");
        return;
    }

    const deletePromises = querySnapshot.docs.map((item) => 
      deleteDoc(doc(db, "foundItems", item.id))
    );
    
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Firebase Delete Error:", error);
    throw error;
  }
};