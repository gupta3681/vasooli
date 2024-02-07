import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Input,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";

const SettingsContent = () => {
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleNotificationsToggle = () =>
    setIsNotificationsEnabled(!isNotificationsEnabled);

  return (
    <Flex direction="column" p={5} w="full" maxW="4xl" mx="auto">
      <Text fontSize="2xl" fontWeight="semibold" mb={6}>
        Settings
      </Text>

      <FormControl mb={4}>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Your name"
          value={name}
          onChange={handleNameChange}
          bg={bgColor}
          borderColor={borderColor}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Your email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          bg={bgColor}
          borderColor={borderColor}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center" mb={4}>
        <FormLabel htmlFor="notifications" mb="0">
          Notifications
        </FormLabel>
        <Switch
          id="notifications"
          isChecked={isNotificationsEnabled}
          onChange={handleNotificationsToggle}
        />
      </FormControl>

      <Button colorScheme="teal" onClick={onOpen} mb={4}>
        Change Password
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Password change form or component goes here */}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Additional settings elements can be added here */}
    </Flex>
  );
};

export default SettingsContent;
