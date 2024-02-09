import React from "react";
import { useState } from "react";
import {
  Box,
  Button,
  VStack,
  Text,
  useColorModeValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Icon,
  Divider,
  Input,
  HStack,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, SettingsIcon, EmailIcon } from "@chakra-ui/icons";

import { InfoIcon, AddIcon, QuestionOutlineIcon } from "@chakra-ui/icons";
import { HamburgerIcon } from "@chakra-ui/icons";

import SidebarContent from "./SideBarContent";
import TrophyBarContent from "./TrophyBarContent";

const TrophyBar = ({ onLogout }) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Hamburger Icon for mobile screens to open the drawer */}
      <Button
        variant="ghost"
        display={{ md: "none" }}
        onClick={onOpen}
        zIndex="overlay"
      >
        <HamburgerIcon />
      </Button>

      {/* Drawer for mobile screens */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody></DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Sidebar for larger screens */}
      <Box
        display={{ base: "none", md: "block" }} // Only display the Box on medium screens and larger
        position="fixed"
        right="0"
        top="inherit"
        h="100vh"
        w={"240px"}
        bg={bgColor}
        borderLeft="1px solid"
        borderColor={borderColor}
        zIndex="banner"
        transition="width 0.2s ease-in-out"
      >
        <TrophyBarContent />
      </Box>
    </>
  );
};

export default TrophyBar;
