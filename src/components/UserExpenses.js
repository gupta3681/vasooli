import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  useColorModeValue,
} from '@chakra-ui/react';
import { collection, query, where, getDocs, doc } from 'firebase/firestore'; // Import 'doc' for document references
import { db, auth } from '../auth/firebase'; // Import 'auth' from Firebase

const UserExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    // Fetch expenses for the currently authenticated user
    const fetchUserExpenses = async () => {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid); // Reference to the current user's document
        const expensesRef = collection(userDocRef, 'expenses'); // Reference to the 'expenses' subcollection
        const querySnapshot = await getDocs(expensesRef);
        const userExpenses = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userExpenses.push({
            amount: data.amount,
            description: data.description,
            createdAt: data.createdAt.toDate(),
            expenseSituation: data.expenseSituation,
          });
        });

        setExpenses(userExpenses);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    if (auth.currentUser) {
      fetchUserExpenses();
    }
  }, []);

  return (
    <Box
      bg={bgColor}
      p={4}
      borderRadius="lg"
      shadow="lg"
      borderWidth="1px"
      maxH="300px" // Set a maximum height for scrolling
      overflowY="auto" // Enable vertical scrolling
    >
      <Heading size="md" mb={2} textAlign="center">
        Potential Expenses
      </Heading>
      <VStack align="start" spacing={2}>
        {expenses.map((expense, index) => (
          <Box key={index}>
            <Text>
              Amount: ${expense.amount}
            </Text>
            <Text>
              Description: {expense.description}
            </Text>
            <Text>
              Date: {expense.createdAt.toDateString()}
            </Text>
            <Text>
              Expense Situation: {expense.expenseSituation}
            </Text>
            <Divider my={2} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default UserExpenses;
