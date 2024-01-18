import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  useColorModeValue,
  Divider,
  Collapse,
  IconButton,
} from "@chakra-ui/react";
import { PlusSquareIcon } from "@chakra-ui/icons"; // Using PlusSquareIcon instead
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import AddExpenseForm from "./AddExpense";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import UserExpenses from "../components/UserExpenses";

const UserPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchUserBalance = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setUserBalance(docSnap.data().balance);
      }
    }
  };

  useEffect(() => {
    fetchUserBalance();
  }, []);

  const onExpenseAdded = () => {
    fetchUserBalance();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleFormVisibility = () => setShowForm(!showForm);

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
        <Text mb={2}>Balance: {userBalance}</Text>
  
        <Divider my={6} />
        <UserExpenses />
        <Divider my={6} />
        
        <IconButton
          aria-label="Add expense"
          icon={<PlusSquareIcon />}
          size="lg"
          colorScheme="teal"
          variant="outline"
          onClick={toggleFormVisibility}
          mb={4}
        />
        
        <Collapse in={showForm} animateOpacity>
          <AddExpenseForm onExpenseAdded={onExpenseAdded} />
        </Collapse>
        
        <Divider my={6} />
        <Button colorScheme="red" mt={4} onClick={handleLogout}>
          Log Out
        </Button>
      </Flex>
    </Box>
  );
};

export default UserPage;
