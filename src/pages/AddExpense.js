import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc as getFirestoreDoc,
} from 'firebase/firestore';
import { auth } from '../auth/firebase';
import { useNavigate } from 'react-router-dom';
import { db } from '../auth/firebase';

const AddExpense = ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [expenseSituation, setExpenseSituation] = useState('youOweThem'); // Default to 'you owe them'
  const toast = useToast();
  const navigate = useNavigate();

  const handleAddExpense = async () => {
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user found.');
      }
  
      const adderUid = auth.currentUser.uid;
  
      // Query the users collection to find the user with the given email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        throw new Error('Recipient not found.');
      } else if (querySnapshot.docs.length > 1) {
        throw new Error('Multiple users found.');
      }
  
      const recipientUid = querySnapshot.docs[0].id;
      const recipientRef = doc(db, 'users', recipientUid);
      const adderRef = doc(db, 'users', adderUid);
  
      // Retrieve the current balances
      const [recipientDoc, adderDoc] = await Promise.all([
        getFirestoreDoc(recipientRef),
        getFirestoreDoc(adderRef),
      ]);
  
      const recipientBalance = recipientDoc.data()?.balance || 0;
      const adderBalance = adderDoc.data()?.balance || 0;
      const expenseAmount = parseFloat(amount);
  
      // Determine the expense type based on the selected situation
      let expenseType;
      if (expenseSituation === 'youOweThem') {
        expenseType = 'debtor';
      } else if (expenseSituation === 'theyOweYou') {
        expenseType = 'creditor';
      } else {
        throw new Error('Invalid expense situation.');
      }
  
      // Calculate new balances based on the expense type
      let newRecipientBalance, newAdderBalance;
      if (expenseType === 'debtor') {
        newRecipientBalance = recipientBalance + expenseAmount;
        newAdderBalance = adderBalance - expenseAmount;
      } else {
        newRecipientBalance = recipientBalance - expenseAmount;
        newAdderBalance = adderBalance + expenseAmount;
      }
  
      // Update balances in Firestore
      await Promise.all([
        updateDoc(recipientRef, { balance: newRecipientBalance }),
        updateDoc(adderRef, { balance: newAdderBalance }),
      ]);
  
      // Add the expense document for adder with the selected type
      await addDoc(collection(db, 'users', adderUid, 'expenses'), {
        adderUid,
        recipientUid,
        amount: expenseAmount,
        description,
        createdAt: new Date(),
        expenseSituation:expenseType,
      });
      
      // Add the expense document for recipient with the opposite type
      await addDoc(collection(db, 'users', recipientUid, 'expenses'), {
        adderUid,
        recipientUid,
        amount: expenseAmount,
        description,
        createdAt: new Date(),
        expenseSituation: expenseType === 'Debtor' ? 'Creditor' : 'Debtor',
      });
  
      toast({
        title: 'Expense added.',
        description: "We've added the expense for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      // Clear the form
      setAmount('');
      setEmail('');
      setDescription('');
  
      // Optional callback for when an expense is successfully added
      if (onExpenseAdded) {
        onExpenseAdded();
      }
    } catch (error) {
      toast({
        title: 'Error.',
        description: `Error adding expense: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch" m={4}>
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
          <option value="youOweThem">You Owe Them</option>
          <option value="theyOweYou">They Owe You</option>
        </Select>
      </FormControl>
      <Button onClick={handleAddExpense} colorScheme="blue" isFullWidth>
        Add Expense
      </Button>
    </VStack>
  );
};

export default AddExpense;
