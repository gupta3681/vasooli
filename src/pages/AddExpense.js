import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
  Select, // Add Select component for the expense situation
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  setDoc,
  getDoc as getFirestoreDoc,
} from "firebase/firestore";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import { db } from "../auth/firebase";

const AddExpense = ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [expenseSituation, setExpenseSituation] = useState("youOweThem"); // Default to 'you owe them'
  const toast = useToast();
  const navigate = useNavigate();
  const borderColor = useColorModeValue("white.500", "white.200");

  const handleAddExpense = async () => {
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

      // References to the balances subcollection documents
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
      const balanceUpdatePromises = [];
      if (!(await getFirestoreDoc(adderBalanceRef)).exists()) {
        balanceUpdatePromises.push(setDoc(adderBalanceRef, { balance: 0 }));
      }
      if (!(await getFirestoreDoc(recipientBalanceRef)).exists()) {
        balanceUpdatePromises.push(setDoc(recipientBalanceRef, { balance: 0 }));
      }
      await Promise.all(balanceUpdatePromises);

      // Retrieve or initialize the current balances
      // Retrieve the current balances again, now that they are guaranteed to exist
      const [adderBalanceDoc, recipientBalanceDoc] = await Promise.all([
        getFirestoreDoc(adderBalanceRef),
        getFirestoreDoc(recipientBalanceRef),
      ]);
      let adderBalance = adderBalanceDoc.exists()
        ? adderBalanceDoc.data().balance
        : 0;
      let recipientBalance = recipientBalanceDoc.exists()
        ? recipientBalanceDoc.data().balance
        : 0;
      const expenseAmount = parseFloat(amount);

      // Determine the expense type based on the selected situation
      let expenseType;
      if (expenseSituation === "youOweThem") {
        expenseType = "debtor";
      } else if (expenseSituation === "theyOweYou") {
        expenseType = "creditor";
      } else if (expenseSituation === "split1") {
        expenseType = "split1";
      } else if (expenseSituation === "split2") {
        expenseType = "split2";
      }

      // Calculate new balances based on the expense type
      if (expenseType === "debtor") {
        recipientBalance += expenseAmount;
        adderBalance -= expenseAmount;
      } else if (expenseType === "creditor") {
        recipientBalance -= expenseAmount;
        adderBalance += expenseAmount;
      } else if (expenseType === "split1") {
        recipientBalance -= expenseAmount / 2;
        adderBalance += expenseAmount / 2;
      } else if (expenseType === "split2") {
        recipientBalance += expenseAmount / 2;
        adderBalance -= expenseAmount / 2;
      }

      // Update the balance documents in the balances subcollection
      await Promise.all([
        updateDoc(adderBalanceRef, { balance: adderBalance }, { merge: true }),
        updateDoc(
          recipientBalanceRef,
          { balance: recipientBalance },
          { merge: true }
        ),
      ]);

      // Add the expense document for adder with the selected type
      await addDoc(collection(db, "users", adderUid, "expenses"), {
        adderUid,
        recipientUid,
        amount: expenseAmount,
        description,
        createdAt: new Date(),
        expenseSituation: expenseType,
      });

      // Determine the expense situation for the recipient
      let expenseSituationForRecipient = {
        debtor: "creditor",
        creditor: "debtor",
        split1: "split2",
        split2: "split1",
      }[expenseType];

      // Add the expense document for recipient with the opposite type
      await addDoc(collection(db, "users", recipientUid, "expenses"), {
        adderUid,
        recipientUid,
        amount: expenseAmount,
        description,
        createdAt: new Date(),
        expenseSituation: expenseSituationForRecipient,
      });

      toast({
        title: "Expense added.",
        description: "We've added the expense for you.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear the form
      setAmount("");
      setEmail("");
      setDescription("");

      // Optional callback for when an expense is successfully added
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      toast({
        title: "Error.",
        description: `Error adding expense: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <VStack
      spacing={4}
      align="stretch"
      m={4}
      width={{ base: "100%", md: "auto" }}
    >
      <FormControl isRequired>
        <FormLabel htmlFor="amount">Amount</FormLabel>
        <NumberInput>
          <NumberInputField
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </NumberInput>
      </FormControl>
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
      <FormControl isRequired>
        <FormLabel htmlFor="expenseSituation">Expense Situation</FormLabel>
        <Select
          id="expenseSituation"
          value={expenseSituation}
          onChange={(e) => setExpenseSituation(e.target.value)}
        >
          <option value="youOweThem">You Owe Them Fully </option>
          <option value="theyOweYou">They Owe You Fully </option>
          <option value="split1">Split paid by you </option>
          <option value="split2">Split paid by them </option>
        </Select>
      </FormControl>
      <Button onClick={handleAddExpense} colorScheme="teal" isFullWidth>
        Add Expense
      </Button>
    </VStack>
  );
};

export default AddExpense;
