import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./config";

export async function deleteAllLostItems() {
  const snapshot = await getDocs(collection(db, "lostItems"));

  const promises = snapshot.docs.map((d) =>
    deleteDoc(doc(db, "lostItems", d.id))
  );

  await Promise.all(promises);
}
