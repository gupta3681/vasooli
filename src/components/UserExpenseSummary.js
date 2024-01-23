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
import { auth,db } from '../auth/firebase';
const UserExpensesSummary = () => {
  const [balances, setBalances] = useState({});
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [currentUserUid, setCurrentUserUid] = useState(null);

  useEffect(() => {
    // Set up an authentication state observer and get user data
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUserUid(user.uid); // Directly use user.uid instead of auth.currentUser.uid
      } else {
        setCurrentUserUid(null);
      }
    });
    // Cleanup the observer when the component unmounts
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUserUid) {
      // If currentUserUid is null, don't attempt to fetch expenses
      return;
    }

    const fetchExpenses = async () => {
      // Now currentUserUid is guaranteed to be non-null
      const expensesRef = collection(db, 'users', currentUserUid, 'expenses');
      const querySnapshot = await getDocs(expensesRef);
      let updatedBalances = {};


      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const { amount, adderUid, recipientUid, expenseSituation } = data;
        const otherUid = adderUid === currentUserUid ? recipientUid : adderUid;

        if (!updatedBalances[otherUid]) {
          updatedBalances[otherUid] = 0;
        }
        switch (expenseSituation) {
          case 'debtor':
            if (adderUid === currentUserUid) {
              updatedBalances[otherUid] -= amount;
            } else {
              updatedBalances[otherUid] += amount;
            }
            break;
          case 'creditor':
            if (adderUid === currentUserUid) {
              updatedBalances[otherUid] += amount;
            } else {
              updatedBalances[otherUid] -= amount;
            }
            break;
          case 'split1':
            // If the current user paid, the other user owes half
            if (adderUid === currentUserUid) {
              updatedBalances[otherUid] += amount / 2;
            } else {
              updatedBalances[otherUid] -= amount / 2;
            }
            break;
          case 'split2':
            // If the current user was supposed to pay, they owe the other user half
            if (adderUid === currentUserUid) {
              updatedBalances[otherUid] -= amount / 2;
            } else {
              updatedBalances[otherUid] += amount / 2;
            }
            break;
          default:
            // Handle unexpected situations
            break;
        }
      });

      setBalances(updatedBalances);
      console.log(updatedBalances);
    };

    fetchExpenses();
  }, [currentUserUid]);
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

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
          {Object.entries(balances).map(([userUid, balance]) => (
            <Tr key={userUid}>
              <Td>{userUid}</Td> {/* Replace with user-friendly identifier */}
              <Td isNumeric>{formatCurrency(balance)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserExpensesSummary;
