import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./config";

// 1. Single Delete (Jo pehle se chal raha hai)
export const deleteFoundItem = async (id) => {
  try {
    await deleteDoc(doc(db, "foundItems", id));
  } catch (error) {
    console.error("Delete Error:", error);
    throw error;
  }
};

// 2. Clear All (Updated to work without 'status' field)
export const deleteAllFoundItems = async () => {
  try {
    const colRef = collection(db, "foundItems");
    const querySnapshot = await getDocs(colRef); // Status check hata diya
    
    if (querySnapshot.empty) return true;

    // Saare documents ko delete karne ke promises
    const deletePromises = querySnapshot.docs.map((d) => 
      deleteDoc(doc(db, "foundItems", d.id))
    );
    
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    console.error("Firebase Clear All Error:", error);
    throw error;
  }
};