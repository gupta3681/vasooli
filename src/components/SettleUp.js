import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  setDoc,
  getDoc as getFirestoreDoc,
  arrayUnion,
} from "firebase/firestore";
import { auth, db } from "../auth/firebase";

const SettleUp = ({ onSettlementCompleted }) => {
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const toast = useToast();

  const handleSettleUp = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error("No authenticated user found.");
      }

      const adderUid = auth.currentUser.uid;
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Recipient not found.");
      } else if (querySnapshot.docs.length > 1) {
        throw new Error("Multiple users found.");
      }

      const recipientUid = querySnapshot.docs[0].id;
      const adderBalanceRef = doc(
        db,
        "users",
        adderUid,
        "balances",
        recipientUid
      );
      const recipientBalanceRef = doc(
        db,
        "users",
        recipientUid,
        "balances",
        adderUid
      );

      // Set both balances to zero
      await Promise.all([
        updateDoc(adderBalanceRef, { balance: 0 }),
        updateDoc(recipientBalanceRef, { balance: 0 }),
      ]);

      // Prepare settlement data
      const newSettlement = {
        settledAt: new Date(),
        description: description,
        settledBy: adderUid,
      };

      // Check if a shared settlement document exists
      const settlementDocId = [adderUid, recipientUid].sort().join("_");
      const settlementRef = doc(db, "settlements", settlementDocId);
      const settlementDoc = await getFirestoreDoc(settlementRef);

      if (settlementDoc.exists()) {
        // Update existing settlement document
        await updateDoc(settlementRef, {
          settlements: arrayUnion(newSettlement),
        });
      } else {
        // Create a new settlement document
        await setDoc(settlementRef, {
          users: [adderUid, recipientUid],
          settlements: [newSettlement],
        });
      }

      toast({
        title: "Settlement completed.",
        description: "The balance has been settled to zero.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setEmail(""); // Clear the email field
      setDescription(""); // Clear the description field

      if (onSettlementCompleted) {
        onSettlementCompleted();
      }
    } catch (error) {
      toast({
        title: "Error.",
        description: `Error settling up: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack
      spacing={{ base: 4, md: 6 }}
      align="stretch"
      m={{ base: 4, sm: 6, md: 8 }}
    >
      <FormControl isRequired>
        <FormLabel htmlFor="email">Recipient's Email</FormLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormControl>
      <Button
        onClick={handleSettleUp}
        colorScheme="teal"
        width={{ base: "full", md: "auto" }}
      >
        Settle Up
      </Button>
    </VStack>
  );
};

export default SettleUp;
