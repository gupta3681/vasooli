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
import { db } from '../auth/firebase'; // Configure your Firebase instance
import { collection, addDoc } from 'firebase/firestore';
import { useForm, Controller } from 'react-hook-form';
import { auth } from '../auth/firebase'; // Configure your Firebase instance
import { useNavigate } from 'react-router-dom';
const AddExpensePage = () => {
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const toast = useToast();

  const handleAddExpense = async data => {
    // Ensure there is a user logged in before trying to add an expense
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

    const uid = auth.currentUser.uid; // Get the UID of the logged-in user

    try {
      // Add a new document with a generated id in the "expenses" collection
      await addDoc(collection(db, 'expenses'), {
        uid, // Link the expense to the user's UID
        amount: parseFloat(data.amount),
        email: data.email, // recipient email
        description: data.description,
        createdAt: new Date(), // Store the date when the expense was added
      });
      toast({
        title: 'Expense added.',
        description: "We've added the expense for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
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
            onChange={e => setAmount(e.target.value)}
          />
        </NumberInput>
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="email">Recipient's Email</FormLabel>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="description">Description</FormLabel>
        <Input
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </FormControl>
      <Button onClick={handleAddExpense} colorScheme="blue" isFullWidth>
        Add Expense
      </Button>
    </VStack>
  );
};

export default AddExpensePage;
