import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export const resolveCase = async (lostId, foundId) => {
  // Lost item ko resolve mark karo
  const lostRef = doc(db, "lostItems", lostId);
  await updateDoc(lostRef, { 
    status: "RESOLVED",
    resolvedAt: serverTimestamp(),
    matchId: foundId 
  });

  // Found item ko resolve mark karo
  const foundRef = doc(db, "foundItems", foundId);
  await updateDoc(foundRef, { 
    status: "RESOLVED",
    resolvedAt: serverTimestamp(),
    matchId: lostId 
  });
};