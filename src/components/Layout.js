// In a new file, e.g., `Layout.js`
import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import NavBar from "./NavBar"; // Adjust path as necessary
import Sidebar from "./SideBar"; // Adjust path as necessary

const Layout = ({ children }) => {
  return (
    <Box>
      <NavBar />
      <Flex>
        <Sidebar />
        <Box flex="1" p="4">
          {children}
        </Box>
      </Flex>
    </Box>
  );
};

export default Layout;
