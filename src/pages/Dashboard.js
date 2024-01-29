import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { ScaleFade } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import AddExpenseForm from "./AddExpense";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../auth/firebase";
import UserExpenses from "../components/UserExpenses";
import UserExpensesSummary from "../components/UserExpenseSummary";
import { AddIcon, ViewIcon } from "@chakra-ui/icons";
import NavBar from "../components/NavBar";
import { emailShortner } from "../helper/HelperFunc";
import Sidebar from "../components/SideBar";
import DashboardContent from "../components/DashboardContent";

const Dashboard = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const navigate = useNavigate();
  const [userBalance, setUserBalance] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showExpenses, setShowExpenses] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const btnRef = React.useRef();

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
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  const toggleFormVisibility = () => {
    setShowForm(!showForm);
    setShowExpenses(false);
  };
  const toggleExpensesVisibility = () => {
    setShowExpenses(!showExpenses);
    setShowForm(false);
  };
  return (
    <Box bg={bgColor} minH="100vh">
      <NavBar email={auth.currentUser?.email} onLogout={handleLogout} />
      <Sidebar />
      <DashboardContent />
    </Box>
  );
};

export default Dashboard;
