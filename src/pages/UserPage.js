import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth"; // Import the signOut function
import { auth } from "../auth/firebase"; // Adjust the path as necessary
import { useNavigate } from "react-router-dom"; // For navigation after logout
import AddExpenseForm from "./AddExpense";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";

const UserPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(null);

  useEffect(() => {
    const fetchUserBalance = async () => {
      // Fetch the user's balance from Firestore
      if (auth.currentUser) {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          setUserBalance(docSnap.data().balance);
          console.log(docSnap.data().balance, "docSnap.data().balance");
        }
      }
    }
    fetchUserBalance();
    console.log(userBalance, "userBalance");
  }, []);
  const onExpenseAdded = () => {
    console.log("Expense added");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to the login page after logout
    } catch (error) {
      console.error("Error signing out: ", error);
      // Handle logout errors here
    }
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12} px={{ base: 2, sm: 12, md: 17 }}>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        mx="auto"
        bg="white"
        p={6}
        borderRadius="lg"
        shadow="lg"
        maxW="2xl"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="lg" mb={6} textAlign="center">
          My Balance Sheet
        </Heading>
        
        <Text mb={2}>User Information about what he owes</Text>
        <Text mb={2}>Balance:{userBalance}</Text>
  
        <Divider my={6} />
        <AddExpenseForm onExpenseAdded={onExpenseAdded} />
        <Box width="full" maxW="md">
          <Text mb={2}>More user details...</Text>
        </Box>
        <Button 
          colorScheme="red" 
          mt={4} 
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Flex>
    </Box>
  );
};

export default UserPage;
