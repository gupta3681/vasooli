import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";
import { collection, query, where, getDocs, doc } from "firebase/firestore"; // Import 'doc' for document references
import { db, auth } from "../auth/firebase"; // Import 'auth' from Firebase

const UserExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    // Fetch expenses for the currently authenticated user
    const fetchUserExpenses = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid); // Reference to the current user's document
        const expensesRef = collection(userDocRef, "expenses"); // Reference to the 'expenses' subcollection
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
        console.error("Error fetching expenses:", error);
      }
    };

    if (auth.currentUser) {
      fetchUserExpenses();
    }
  }, []);
  return (
    <Box
      p={4}
      borderRadius="lg"
      shadow="lg"
      borderWidth="1px"
      borderColor={borderColor}
      w="100%"
      maxW="2xl"
      maxH="300px" // Set a maximum height for the table container
      overflowY="auto" // Enable vertical scrolling
    >
      <Box
        w="100%"
        h="100%"
        overflowY="auto" // Set the Box containing the table to be scrollable
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Amount</Th>
              <Th>Description</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {expenses.map((expense, index) => (
              <Tr key={index}>
                <Td
                  color={
                    expense.expenseSituation === "creditor"
                      ? "green.500"
                      : "red.500"
                  }
                >
                  ${expense.amount}
                </Td>
                <Td>{expense.description}</Td>
                <Td>{expense.createdAt.toDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default UserExpenses;
