import React, { useState, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  useColorModeValue,
  TableCaption,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";

import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../auth/firebase";
import { formatCurrency } from "../helper/HelperFunc";
import { getUserName } from "../helper/HelperFunc";
import { HamburgerIcon } from "@chakra-ui/icons";

const UserExpensesSummary = () => {
  const [balances, setBalances] = useState([]);
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const [currentUserUid, setCurrentUserUid] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUserUid(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (currentUserUid) {
        const balancesRef = collection(db, "users", currentUserUid, "balances");
        const querySnapshot = await getDocs(balancesRef);
        const balancePromises = querySnapshot.docs.map(async (doc) => {
          const userUid = doc.id;
          const userName = await getUserName(userUid);
          return {
            userName, // use userName instead of userUid
            balance: doc.data().balance,
          };
        });

        const fetchedBalances = await Promise.all(balancePromises);
        setBalances(fetchedBalances);
        console.log(fetchedBalances, "fetchedBalances");
      }
    };

    fetchBalances();
  }, [currentUserUid]);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      borderColor={borderColor}
      marginTop={3}
      overflowX="auto"
    >
      <Table variant="simple">
        <TableCaption placement="top">Balance table</TableCaption>
        <Thead>
          <Tr>
            <Th>User Name</Th>
            <Th isNumeric>Total Balance</Th>
            <Th>Last Settled</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {balances.map(({ userName, balance }) => (
            <Tr key={userName}>
              <Td>{userName}</Td>
              <Td isNumeric color={balance >= 0 ? "green.500" : "red.500"}>
                {formatCurrency(balance)}
              </Td>
              <Td>Tuesday</Td>
              <Td>
                <Menu>
                  <MenuButton as={Button} Icon={<HamburgerIcon />} />
                  <MenuList>
                    <MenuItem>Settle</MenuItem>
                    <MenuItem>Send Reminder</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserExpensesSummary;
