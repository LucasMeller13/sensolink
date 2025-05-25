import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase-sdk";

async function getAllDocumentIds() {
  try {
    const querySnapshot = await getDocs(collection(db, "sensors"));
    const ids = [];
    querySnapshot.forEach((doc) => {
      ids.push(doc.id);
    });
    return ids;
  } catch (error) {
    console.error("Erro ao buscar os IDs:", error);
    return [];
  }
}

function generateRandomId(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function generateUniqueSensorId(existingIds) {
  let newId;
  do {
    newId = generateRandomId(6);
  } while (existingIds.includes(newId));
  return newId;
}



export {getAllDocumentIds,generateUniqueSensorId}