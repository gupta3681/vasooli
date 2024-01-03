import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Stack,
  useColorModeValue,
  Divider,
  Input,
} from "@chakra-ui/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../auth/firebase";

const UserPage = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const TransactionItem = ({ id }) => {
    return (
      <Flex
        p={4}
        justifyContent="space-between"
        alignItems="center"
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Box>
          <Text>Transaction #{id}</Text>
          <Text fontSize="sm" color="gray.500">
            Details about the transaction...
          </Text>
        </Box>
        <Flex>
          <Button size="sm" colorScheme="blue" mr={2}>
            Acknowledge
          </Button>
          <Button size="sm" colorScheme="red">
            Deny
          </Button>
        </Flex>
      </Flex>
    );
  };

  const SearchUser = () => {
    const [email, setEmail] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
      setLoading(true);
      const usersRef = collection(db, "users"); // Adjust to your Firebase users collection name
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUser(userData.length > 0 ? userData[0] : null);
      setLoading(false);
    };

    return (
      <Box my={4}>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search by email"
          mb={2}
        />
        <Button onClick={handleSearch} isLoading={loading}>
          Search
        </Button>
        {user ? (
          <Text mt={2}>User Found: {user.email}</Text>
        ) : (
          <Text>User Not Found</Text>
        )}
        {/* Expand this section to show more user details or add expense functionality */}
      </Box>
    );
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
          Requests
        </Heading>
        <SearchUser />
        <Box
          width="full"
          maxW="md"
          mb={6}
          height="320px" // Set a fixed height
          overflowY="auto" // Enable vertical scrolling
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
        >
          <Stack spacing={4} p={2}>
            {/* List of Transactions */}
            {[...Array(10).keys()].map(
              (
                id // Sample array to simulate more transactions
              ) => (
                <TransactionItem key={id} id={id} />
              )
            )}
          </Stack>
        </Box>
        <Divider my={6} />
        <Box width="full" maxW="md">
          <Text mb={2}>More user details...</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserPage;
