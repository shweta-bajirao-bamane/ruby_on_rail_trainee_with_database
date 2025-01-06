import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; // Ensure this points to your Firebase config file

/**
 * Retrieves the next sequential UID and updates the counter in Firestore.
 * @returns {Promise<number>} - The next UID.
 */
const getNextUid = async () => {
  const counterRef = doc(db, "counters", "usersCounter");

  try {
    const counterDoc = await getDoc(counterRef);

    if (counterDoc.exists()) {
      const currentUid = counterDoc.data().usersLastUid || 0;
      const nextUid = currentUid + 1;

      // Update the counter in Firestore
      await updateDoc(counterRef, { usersLastUid: nextUid });

      return nextUid;
    } else {
      throw new Error("Counter document does not exist in Firestore.");
    }
  } catch (error) {
    console.error("Error retrieving next UID:", error);
    throw error;
  }
};

export default getNextUid;
