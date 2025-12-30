import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config";

export const getOpenFound = async () => {
  const q = query(collection(db, "foundItems"), where("status", "==", "OPEN"));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};
