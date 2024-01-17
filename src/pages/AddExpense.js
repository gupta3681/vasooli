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
  useToast,
} from '@chakra-ui/react';
import { db } from '../auth/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth } from '../auth/firebase';
import { useNavigate } from 'react-router-dom';

const AddExpense= ({ onExpenseAdded }) => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const toast = useToast();

  const handleAddExpense = async () => {
    if (!auth.currentUser) {
      toast({
        title: 'Error.',
        description: 'No authenticated user found.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const adderUid = auth.currentUser.uid;

    try {
      // Query the users collection to find the user with the given email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast({
          title: 'Error.',
          description: 'Recipient not found.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      } 
      else if (querySnapshot.docs.length > 1) {
        toast({
          title: 'Error.',
          description: 'Multiple users found.',
          status: 'error',
          duration: 5000,
          isClosable: true,  
        });
        return;
      }
      

      const recipientUid = querySnapshot.docs[0].id;

      // Add a new document in the "expenses" collection
      await addDoc(collection(db, 'expenses'), {
        adderUid,
        recipientUid,
        amount: parseFloat(amount),
        description,
        createdAt: new Date(),
      });

      toast({
        title: 'Expense added.',
        description: "We've added the expense for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

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
      <Button onClick={handleAddExpense} colorScheme="blue" isFullWidth>
        Add Expense
      </Button>
    </VStack>
  );
};

export default AddExpense;
