import { collection, addDoc, getDocs, query, where, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config"; // <- ensure this exports `db`

import { uploadImage } from "./upload";

export async function addLostItem(item, imageFile) {
  let imageURL = null;
  if (imageFile) {
    imageURL = await uploadImage(imageFile, "lost-images");
  }

  const ref = await addDoc(collection(db, "lostItems"), { ...item, imageURL, createdAt: serverTimestamp() });
  return { id: ref.id, ...item, imageURL };
}

export async function addFoundItem(item, imageFile) {
  let imageURL = null;
  if (imageFile) {
    imageURL = await uploadImage(imageFile, "found-images");
  }

  const ref = await addDoc(collection(db, "foundItems"), { ...item, imageURL, createdAt: serverTimestamp() });
  return { id: ref.id, ...item, imageURL };
}

export async function getOpenLostItems() {
  const q = query(collection(db, "lostItems"), where("status", "==", "OPEN"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getOpenFoundItems() {
  const q = query(collection(db, "foundItems"), where("status", "==", "OPEN"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deletePendingItem(id) {
  // try both collections
  try { await deleteDoc(doc(db, "lostItems", id)); return; } catch (e) { }
  try { await deleteDoc(doc(db, "foundItems", id)); return; } catch (e) { }
  throw new Error("Item not found to delete");
}

export async function resolveLostItem(lostId, foundId) {
  // mark lost item as resolved and optionally found item as resolved
  await updateDoc(doc(db, "lostItems", lostId), { status: "RESOLVED", resolvedAt: serverTimestamp(), matchedFoundId: foundId });
  if (foundId) {
    await updateDoc(doc(db, "foundItems", foundId), { status: "RESOLVED", resolvedAt: serverTimestamp(), matchedLostId: lostId });
  }
}
