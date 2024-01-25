import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  useColorModeValue,
} from '@chakra-ui/react';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../auth/firebase';
import { formatCurrency } from '../helper/HelperFunc';

const UserExpensesSummary = () => {
  const [balances, setBalances] = useState([]);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [currentUserUid, setCurrentUserUid] = useState(null);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUserUid(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (currentUserUid) {
        const balancesRef = collection(db, 'users', currentUserUid, 'balances');
        const querySnapshot = await getDocs(balancesRef);
        const fetchedBalances = querySnapshot.docs.map(doc => ({
          userUid: doc.id, // This assumes the doc.id is the other user's UID
          balance: doc.data().balance,
        }));
        setBalances(fetchedBalances);
      }
    };

    fetchBalances();
  }, [currentUserUid]);


  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" borderColor={borderColor}>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>User</Th>
            <Th isNumeric>Total Balance</Th>
          </Tr>
        </Thead>
        <Tbody>
          {balances.map(({ userUid, balance }) => (
            <Tr key={userUid}>
              <Td>{userUid}</Td> {/* Replace with user-friendly identifier if available */}
              <Td isNumeric>{formatCurrency(balance)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserExpensesSummary;
