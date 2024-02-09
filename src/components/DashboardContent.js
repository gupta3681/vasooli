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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

import { FaList, FaChartBar } from "react-icons/fa";
import { formatCurrency } from "../helper/HelperFunc";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../auth/firebase";
import { getUserName } from "../helper/HelperFunc";
import { useEffect, useState } from "react";
import AddExpense from "./AddExpense";
import SettleUp from "./SettleUp";
const DashboardContent = () => {
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const avatarSize = useBreakpointValue({ base: "sm", md: "md" });
  const isMobile = useBreakpointValue({ base: true, md: false });
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [balances, setBalances] = useState([]);
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [totalUserBalance, setTotalUserBalance] = useState(0);
  const [totalOwedToYou, setTotalOwedToYou] = useState(0);
  const [totalYouOwe, setTotalYouOwe] = useState(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSettleUpOpen,
    onOpen: onSettleUpOpen,
    onClose: onSettleUpClose,
  } = useDisclosure();

  // Fetch balances when the component mounts

  // Using local state to store the user uid
  useEffect(() => {
    // This effect runs once on mount to load the currentUserUid from localStorage
    const storedUid = window.localStorage.getItem("currentUserUid");
    if (storedUid) {
      setCurrentUserUid(storedUid);
    }

    // Set up the listener for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const uid = user ? user.uid : null;
      setCurrentUserUid(uid);
      // If there's a user, we also update localStorage
      if (uid) {
        window.localStorage.setItem("currentUserUid", uid);
      } else {
        window.localStorage.removeItem("currentUserUid");
      }
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  }, []); // Run this effect once on mount

  useEffect(() => {
    const fetchBalances = async (uid) => {
      // Check for cached balances first
      const cachedBalances = sessionStorage.getItem(`balances-${uid}`);
      if (cachedBalances) {
        setBalances(JSON.parse(cachedBalances));
      } else {
        const balancesRef = collection(db, "users", uid, "balances");
        const querySnapshot = await getDocs(balancesRef);
        const fetchedBalances = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const userUid = doc.id;
            const userName = await getUserName(userUid);
            const balance = doc.data().balance;
            return { userName, balance };
          })
        );
        setBalances(fetchedBalances);
        // Cache the fetched balances
        sessionStorage.setItem(
          `balances-${uid}`,
          JSON.stringify(fetchedBalances)
        );
      }
    };

    const uid = window.localStorage.getItem("currentUserUid");
    if (uid) {
      fetchBalances(uid);
    }
  }, [currentUserUid]);

  useEffect(() => {
    // Calculate and set total balances
    const totalBalance = balances.reduce(
      (acc, { balance }) => acc + balance,
      0
    );
    const owedToYou = balances
      .filter(({ balance }) => balance > 0)
      .reduce((acc, { balance }) => acc + balance, 0);
    const youOwe = balances
      .filter(({ balance }) => balance < 0)
      .reduce((acc, { balance }) => acc + balance, 0);

    setTotalUserBalance(totalBalance);
    setTotalOwedToYou(owedToYou);
    setTotalYouOwe(Math.abs(youOwe)); // Convert to a positive number for consistency
  }, [balances]); // This effect runs when balances state updates

  const youAreOwedList = balances
    .filter((balance) => balance.balance > 0)
    .map((balance) => (
      <Flex key={balance.userName} align="center" mb={2} mt={2}>
        <Avatar name={balance.userName} size={avatarSize} mr={2} />
        <Text fontSize="md">
          {balance.userName} owes you{" "}
          {formatCurrency(Math.abs(balance.balance))}
        </Text>
      </Flex>
    ));

  const youOweList = balances
    .filter((balance) => balance.balance < 0)
    .map((balance) => (
      <Flex key={balance.userName} align="center" mb={2} mt={2}>
        <Avatar name={balance.userName} size={avatarSize} mr={2} />
        <Text fontSize="md">
          You owe {balance.userName} {formatCurrency(Math.abs(balance.balance))}
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
          <Button colorScheme="teal" size={buttonSize} onClick={onOpen}>
            Add an expense
          </Button>
          <Button variant="outline" size={buttonSize} onClick={onSettleUpOpen}>
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
          <Text
            fontSize="xl"
            fontWeight="bold"
            color={totalUserBalance > 0 ? "green.500" : "red.500"}
          >
            {formatCurrency(totalUserBalance)}
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
          <Text fontSize="xl" fontWeight="bold" color="red.500">
            {formatCurrency(Math.abs(totalYouOwe))}
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
            {formatCurrency(totalOwedToYou)}
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
      <Modal isOpen={isOpen} onClose={onClose} colorScheme="teal">
        <ModalOverlay />
        <ModalContent borderColor="teal.500" borderWidth="1px">
          <ModalHeader>Add Your Exepense</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddExpense onExpenseAdded={onClose} />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isSettleUpOpen}
        onClose={onSettleUpClose}
        colorScheme="teal"
      >
        <ModalOverlay />
        <ModalContent borderColor="teal.500" borderWidth="1px">
          <ModalHeader>Settle Up</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SettleUp onSettlementCompleted={onSettleUpClose} />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default DashboardContent;
