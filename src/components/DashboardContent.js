import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  useBreakpointValue,
  Stack,
  Avatar,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaList, FaChartBar } from "react-icons/fa";
import { formatCurrency } from "../helper/HelperFunc";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../auth/firebase";
import { getUserName } from "../helper/HelperFunc";
import { useEffect, useState } from "react";

const DashboardContent = () => {
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const avatarSize = useBreakpointValue({ base: "sm", md: "md" });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [balances, setBalances] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState(null);

  // Fetch balances when the component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUserUid(user ? user.uid : null);
    });

    const fetchBalances = async () => {
      if (currentUserUid) {
        const balancesRef = collection(db, "users", currentUserUid, "balances");
        const querySnapshot = await getDocs(balancesRef);

        // Use Promise.all to wait for all the getUserName Promises to resolve
        const balances = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const userUid = doc.id;
            const userName = await getUserName(userUid); // Await the Promise returned by getUserName
            const balance = doc.data().balance;
            return { userName, balance }; // Returns an object with userName and balance
          })
        );
        setBalances(balances); // Update state with the resolved array of balances
        console.log(balances, "fetchedBalances");
      }
    };
    fetchBalances();
    return unsubscribe;
  }, [currentUserUid]);

  const youOweList = balances
    .filter((balance) => balance.balance > 0)
    .map((balance) => (
      <Flex key={balance.userName} align="center" mb={2} mt={2}>
        <Avatar name={balance.userName} size={avatarSize} mr={2} />
        <Text fontSize="md">
          You owe {balance.userName} {formatCurrency(balance.balance)}
        </Text>
      </Flex>
    ));

  const youAreOwedList = balances
    .filter((balance) => balance.balance < 0)
    .map((balance) => (
      <Flex key={balance.userName} align="center" mb={2} mt={2}>
        <Avatar name={balance.userName} size={avatarSize} mr={2} />
        <Text fontSize="md">
          {balance.userName} owes you{" "}
          {formatCurrency(Math.abs(balance.balance))}
        </Text>
      </Flex>
    ));

  return (
    <Flex direction="column" p={5} w="full" maxW="4xl" mx="auto">
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={4}
        align="center"
        justify="space-between"
        mb={6}
      >
        <Text fontSize="2xl" fontWeight="semibold">
          Dashboard
        </Text>
        <Stack direction="row" spacing={2}>
          <Button colorScheme="teal" size={buttonSize}>
            Add an expense
          </Button>
          <Button variant="outline" size={buttonSize}>
            Settle up
          </Button>
        </Stack>
      </Stack>

      <Flex direction={{ base: "column", md: "row" }} mb={6} spacing={4}>
        <Box
          flex={1}
          bg={bgColor}
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          mr={4}
        >
          <Text mb={2} fontSize="sm">
            Total Balance
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="green.500">
            + $25.00
          </Text>
        </Box>
        <Box
          flex={1}
          bg={bgColor}
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          mr={4}
        >
          <Text mb={2} fontSize="sm">
            You owe
          </Text>
          <Text fontSize="xl" fontWeight="bold">
            $0.00
          </Text>
        </Box>
        <Box
          flex={1}
          bg={bgColor}
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Text mb={2} fontSize="sm">
            You are owed
          </Text>
          <Text fontSize="xl" fontWeight="bold" color="green.500">
            $25.00
          </Text>
        </Box>
      </Flex>
      <Flex direction={{ base: "column", md: "row" }} spacing={4} mb={6}>
        {/* You Owe Section */}
        <Box
          w="full"
          bg={bgColor}
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          mr={4}
        >
          {/* ... */}
          <Text fontSize="lg" fontWeight="bold">
            YOU OWE
          </Text>
          {youOweList.length > 0 ? (
            youOweList
          ) : (
            <Text>You do not owe anything</Text>
          )}
        </Box>

        {/* You Are Owed Section */}
        <Box
          w="full"
          bg={bgColor}
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          {/* ... */}
          <Text fontSize="lg" fontWeight="bold">
            YOU ARE OWED
          </Text>
          {youAreOwedList.length > 0 ? (
            youAreOwedList
          ) : (
            <Text>No one owes you anything</Text>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardContent;
