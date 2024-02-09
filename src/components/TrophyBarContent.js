import React from "react";
import {
  Box,
  VStack,
  Text,
  useColorModeValue,
  HStack,
  Badge,
} from "@chakra-ui/react";

const TrophyBarContent = () => {
  // Dummy data for friends' credit ratings
  const friendsCreditRatings = [
    { name: "Aryan Gupta", rating: 800 },
    { name: "Riya Singh", rating: 750 },
    { name: "Aditya Raj", rating: 780 },
    { name: "Rahul Sharma", rating: 790 },
    { name: "Kriti Agarwal", rating: 760 },
    // Add more friends as needed
  ];

  const recentTransactions = [
    { date: "Today", amount: "-$200" },
    { date: "Yesterday", amount: "-$35" },
    // Add more transactions as needed
  ];

  const financialGoals = [
    { goal: "Hawaii", progress: "70%" },
    { goal: "Maldives", progress: "40%" },
    // Add more goals as needed
  ];

  // Sort friends by credit rating in descending order
  const sortedFriends = friendsCreditRatings.sort(
    (a, b) => b.rating - a.rating
  );

  // Define colors and styles
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const borderColor = useColorModeValue("teal.500", "teal.200");

  return (
    <VStack spacing={4} align="start" p={4} w="full">
      <Box
        w="full"
        bg={bgColor}
        p={4}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" fontWeight="semibold" mb={4} color={textColor}>
          Top Credit Ratings
        </Text>
        <VStack spacing={2}>
          {sortedFriends.map((friend, index) => (
            <HStack key={index} w="full" justify="space-between">
              <Text fontSize="sm" color={textColor} isTruncated>
                {friend.name}
              </Text>
              <Badge colorScheme="green" variant="subtle">
                {friend.rating}
              </Badge>
            </HStack>
          ))}
        </VStack>
      </Box>
      <Box
        bg={bgColor}
        w="full"
        p={4}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
        mt={4}
      >
        <Text fontSize="lg" fontWeight="semibold" mb={4} color={textColor}>
          Recent Transactions
        </Text>
        <VStack spacing={2}>
          {recentTransactions.map((transaction, index) => (
            <HStack key={index} w="full" justify="space-between">
              <Text fontSize="sm" color={textColor} isTruncated>
                {transaction.date}
              </Text>
              <Badge
                colorScheme={
                  transaction.amount.startsWith("-") ? "red" : "green"
                }
              >
                {transaction.amount}
              </Badge>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Financial Goals Box */}
      <Box
        bg={bgColor}
        w="full"
        p={4}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
        mt={4}
      >
        <Text fontSize="lg" fontWeight="semibold" mb={4} color={textColor}>
          Financial Goals
        </Text>
        <VStack spacing={2}>
          {financialGoals.map((goal, index) => (
            <HStack key={index} w="full" justify="space-between">
              <Text fontSize="sm" color={textColor} isTruncated>
                {goal.goal}
              </Text>
              <Text fontSize="sm" color={textColor}>
                {goal.progress}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </VStack>
  );
};

export default TrophyBarContent;
