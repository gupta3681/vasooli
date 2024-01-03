import React from 'react';
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  Stack,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';

const UserPage = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const TransactionItem = ({ id }) => {
    return (
      <Flex
        p={4}
        justifyContent="space-between"
        alignItems="center"
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Box>
          <Text>Transaction #{id}</Text>
          <Text fontSize="sm" color="gray.500">
            Details about the transaction...
          </Text>
        </Box>
        <Flex>
          <Button size="sm" colorScheme="blue" mr={2}>
            Acknowledge
          </Button>
          <Button size="sm" colorScheme="red">
            Deny
          </Button>
        </Flex>
      </Flex>
    );
  };

  return (
    <Box bg={bgColor} minH="100vh" py={12} px={{ base: 2, sm: 12, md: 17 }}>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        mx="auto"
        bg="white"
        p={6}
        borderRadius="lg"
        shadow="lg"
        maxW="2xl"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Heading size="lg" mb={6} textAlign="center">
          Requests
        </Heading>
        <Box
          width="full"
          maxW="md"
          mb={6}
          height="320px" // Set a fixed height
          overflowY="auto" // Enable vertical scrolling
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
        >
          <Stack spacing={4} p={2}>
            {/* List of Transactions */}
            {[...Array(10).keys()].map(
              (
                id // Sample array to simulate more transactions
              ) => (
                <TransactionItem key={id} id={id} />
              )
            )}
          </Stack>
        </Box>
        <Divider my={6} />
        <Box width="full" maxW="md">
          <Text mb={2}>More user details...</Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserPage;
