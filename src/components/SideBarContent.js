import React, { useEffect, useState } from "react";
import { ViewIcon, SettingsIcon, EmailIcon } from "@chakra-ui/icons";
import { InfoIcon, AddIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  VStack,
  Text,
  useColorModeValue,
  Icon,
  Divider,
  Input,
  HStack,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../auth/firebase";

const SidebarContent = ({ isExpanded }) => {
  const [email, setEmail] = useState("");
  const borderColor = useColorModeValue("teal.500", "teal.200"); // Change as per your color mode
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const navigate = useNavigate();

  const handleInvite = () => {
    console.log("email");
    setEmail("");
  };

  const onLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
      console.log("Logged out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // Assuming you're storing balances data in sessionStorage under the key "balances-<userID>"
    const currentUserUid = localStorage.getItem("currentUserUid"); // Get the current user's UID

    const storedBalances = sessionStorage.getItem(`balances-${currentUserUid}`);
    console.log("storedBalances", storedBalances);
    if (storedBalances) {
      const balances = JSON.parse(storedBalances);
      const friendUsernames = balances.map((balance) => balance.userName); // Extract usernames from balances
      setFriends(friendUsernames);
    }
  }, []);

  return (
    <VStack spacing={4} align="start" p={4}>
      <Button
        variant="ghost"
        justifyContent="start"
        w="full"
        onClick={() => navigate("/dashboard")}
      >
        <Icon as={ViewIcon} mr={2} />
        <Text fontSize="medium" fontWeight="light">
          Dashboard
        </Text>
      </Button>
      <Button
        variant="ghost"
        justifyContent="start"
        w="full"
        onClick={() => navigate("/settings")}
      >
        <Icon as={SettingsIcon} mr={2} />
        <Text fontSize="medium" fontWeight="light">
          Settings
        </Text>
      </Button>
      <Button
        variant="ghost"
        justifyContent="start"
        w="full"
        onClick={onLogout}
      >
        <Icon as={FaSignOutAlt} mr={2} />
        <Text fontSize="medium" fontWeight="light">
          Sign Out
        </Text>
      </Button>
      <Divider />
      <Box
        w="full"
        p={2}
        borderRadius="md"
        borderWidth="1px" // Add a border
        borderColor={borderColor} // Use the borderColor for the border
      >
        <Text fontSize="lg" fontWeight="semibold">
          Invite friends
        </Text>
        <Input
          placeholder="Enter an email address"
          mt={2}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          leftIcon={<EmailIcon />}
          mt={2}
          colorScheme="teal"
          variant="solid"
          w="full"
          onClick={handleInvite}
        >
          Send invite
        </Button>
      </Box>
      <Divider />
      {/* Groups section */}
      <Box
        w="full"
        bg={bgColor}
        p={2}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <HStack spacing={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor}>
            GROUPS
          </Text>
          <Spacer />
          <IconButton
            variant="ghost"
            icon={<AddIcon />}
            aria-label="Add group"
            size="sm"
            onClick={() => {
              /* add group logic */
            }}
          />
          <IconButton
            variant="ghost"
            icon={<QuestionOutlineIcon />}
            aria-label="Group help"
            size="sm"
          />
        </HStack>
        <Text fontSize="sm" color={textColor}>
          We are currently developing this feature. Stay tuned!
        </Text>
      </Box>
      {/* Friends section */}
      <Box
        w="full"
        bg={bgColor}
        p={2}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <HStack spacing={2}>
          <Text fontSize="md" fontWeight="semibold" color={textColor}>
            FRIENDS
          </Text>
          <Spacer />
          <IconButton
            variant="ghost"
            icon={<AddIcon />}
            aria-label="Add friend"
            size="sm"
            onClick={() => {
              /* add friend logic */
            }}
          />
        </HStack>
        <HStack spacing={2}>
          <VStack align="start" w="full">
            {friends.map((friend, index) => (
              <HStack key={index} w="full">
                <Icon as={InfoIcon} color="teal.500" />
                <Text fontSize="sm" color={textColor} isTruncated>
                  {friend}
                </Text>
              </HStack>
            ))}
          </VStack>
        </HStack>
      </Box>
    </VStack>
  );
};
export default SidebarContent;
