import React from "react";
import {
  Button,
  Flex,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";

const NavBar = ({ onLogout }) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between" // Changed to space-between for spacing the logo and the menu items
      wrap="wrap"
      padding="0.5rem"
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      {/* Logo */}
      <Text fontSize="lg" fontWeight="light">
        Vasooli
      </Text>
      <Flex align="center">
        {/* Profile Dropdown */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
          >
            <Avatar size="sm" name="Aryan Gupta" mr="12px" />{" "}
            {/* Adjust the margin as needed */}
          </MenuButton>
          <MenuList>
            <MenuItem>Profile</MenuItem>
            <MenuItem>Contact Support</MenuItem>
            <MenuItem onClick={onLogout}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default NavBar;
