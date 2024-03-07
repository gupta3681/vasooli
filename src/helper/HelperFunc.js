import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import { auth } from "../auth/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

export const emailShortner = (email) => {
  return email.split("@")[0];
};

export async function getUserName(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const fullName = userSnap.data().name;
    // Split the full name by space and return the first part (first name)
    const firstName = fullName.split(" ")[0];
    return firstName;
  } else {
    return "Unknown User";
  }
}
