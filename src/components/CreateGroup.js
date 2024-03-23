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
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../auth/firebase";

export const CreateGroup = () => {
  const [newEmail, setNewEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [groupName, setGroupName] = useState(""); // Updated for group name

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

  // Placeholder function for saving group info
  const saveGroup = async () => {
    try {
      // Assuming `emails` is an array of email strings
      // You might want to resolve these emails to user IDs or document references for more robust linking

      // Add a new document to the groups collection
      const docRef = await addDoc(collection(db, "groups"), {
        name: groupName,
        members: emails, // Store the array of member emails
        createdAt: new Date(), // Optional: Store the creation date of the group
      });
      console.log("Group added with ID:", docRef.id);

      setGroupName("");
      setEmails([]);
    } catch (e) {
      console.error("Error adding document: ", e);
      // Optional: Show an error message to the user
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
      >
        Create
      </Button>
    </VStack>
  );
};
