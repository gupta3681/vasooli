import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import { auth } from "../auth/firebase";



export const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };


  export const emailShortner = (email) => {
    return email.split("@")[0];
  }

  export async function getUserName(uid) {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? emailShortner(userSnap.data().email) : 'Unknown User';
  }