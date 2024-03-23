import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  List,
  ListItem,
  IconButton,
  Box,
  useToast, // Correctly import useToast
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../auth/firebase"; // Ensure these are correctly imported

export const CreateGroup = () => {
  const [newEmail, setNewEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [groupName, setGroupName] = useState(""); // For group name
  const toast = useToast();

  const addEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      // Prevent adding empty or duplicate emails
      setEmails([...emails, newEmail]);
      setNewEmail(""); // Clear the input after adding
    }
  };

  const removeEmail = (index) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const saveGroup = async () => {
    try {
      // Validate the current user
      const adderUid = auth.currentUser?.uid;
      if (!adderUid) {
        throw new Error("Authentication required.");
      }

      // Prepare to validate emails
      const usersRef = collection(db, "users");
      const validEmails = [];

      // Check each email against registered users
      for (const email of emails) {
        const q = query(usersRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          validEmails.push(email); // Add valid emails to a new list
        }
      }
      if (validEmails.length <= 1) {
        throw new Error("Group must have at least two members.");
      }

      if (validEmails.length !== emails.length) {
        throw new Error("One or more emails are not registered users.");
      }

      // Save the group with validated emails
      const docRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        members: validEmails,
        createdAt: new Date(),
      });

      toast({
        title: "Group created.",
        description: "The group has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear form state
      setGroupName("");
      setEmails([]);
    } catch (e) {
      console.error("Error: ", e);
      toast({
        title: "An error occurred.",
        description: e.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack
      spacing={{ base: 4, md: 6 }}
      align="stretch"
      m={{ base: 4, sm: 6, md: 8 }}
    >
      <FormControl isRequired>
        <FormLabel htmlFor="group-name">Group Name</FormLabel>
        <Input
          id="group-name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="email">Member's Email</FormLabel>
        <Box display="flex">
          <Input
            id="email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Add member's email"
          />
          <Button ml={2} onClick={addEmail} colorScheme="teal">
            Add
          </Button>
        </Box>
      </FormControl>
      {emails.length > 0 && (
        <List spacing={3}>
          {emails.map((email, index) => (
            <ListItem key={index} display="flex" alignItems="center">
              {email}
              <IconButton
                icon={<DeleteIcon />}
                aria-label="Remove email"
                ml={2}
                size="sm"
                onClick={() => removeEmail(index)}
              />
            </ListItem>
          ))}
        </List>
      )}
      <Button
        onClick={saveGroup}
        colorScheme="teal"
        width={{ base: "full", md: "auto" }}
        isDisabled={!groupName || emails.length < 2}
      >
        Create
      </Button>
    </VStack>
  );
};
