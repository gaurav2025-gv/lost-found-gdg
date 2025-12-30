import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./config";

export async function deleteLostItem(id) {
  await deleteDoc(doc(db, "lostItems", id));
}
