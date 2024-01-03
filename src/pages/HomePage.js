import React from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Image,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const onClickLogin = () => {
    navigate('/login');
  };

  const onClickSignUp = () => {
    navigate('/signup');
  };

  return (
    <Box bg="white" w="100%" p={4}>
      <Flex justify="space-between" align="center" mb={12}>
        <Text fontSize="small">Vasooli</Text>
        <Stack direction="row" spacing={4}>
          <Button onClick={onClickLogin} variant="link" colorScheme="blue">
            Log in
          </Button>
          <Button onClick={onClickSignUp} colorScheme="green">
            Sign up
          </Button>
        </Stack>
      </Flex>
      <Flex
        direction={{ base: 'column', md: 'row' }} // Adjust direction for responsiveness
        align="center"
        justify="center"
        p={8}
      >
        <Box flex="1" mb={{ base: 8, md: 0 }} pr={{ md: 8 }}>
          <Heading as="h1" size="2xl" mb={4}>
            Ease your mind with Vasooli's charm, Find joy, no cause for alarm.
          </Heading>
          <Text fontSize="lg" mb={8}>
            Keep track of your shared expenses and balances with everyone and
            anyone.
          </Text>
          <Button size="lg" colorScheme="purple" onClick={onClickSignUp}>
            Sign up
          </Button>
        </Box>
        <Box
          flex="1"
          display={{ base: 'flex' }} 
          alignItems="center"
          justifyContent="center"
          maxW={{ base: '100%', md: '50%' }}
        >
          <Image
            src="/landing-image.png"
            alt="Vasooli Landing Image"
            maxW="100%"
            maxH={{ base: 'auto', md: '400px' }} 
            objectFit="contain"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default HomePage;
