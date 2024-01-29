import React from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  useColorModeValue,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { auth } from "../auth/firebase";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUpPage = () => {
  const { handleSubmit, register } = useForm();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.50", "gray.700");

  const onSignUp = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(userCredential);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during sign-up: ", error);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={bgColor}
      direction={{ base: "column", md: "row" }}
    >
      <Box
        flexBasis={{ base: "100%", md: "50%" }}
        display={{ base: "none", md: "block" }}
      >
        <Image
          src="/signUp.png" // Replace with the path to your image
          alt="Sign Up"
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Box>
      <Flex p={8} flex={1} align="center" justify="center">
        <Box
          borderWidth={1}
          px={8}
          py={4}
          borderRadius={8}
          boxShadow="lg"
          bg="white"
          w="full"
          maxW="md"
        >
          <Heading as="h2" size="xl" textAlign="center" mb={6}>
            Sign Up
          </Heading>
          <form onSubmit={handleSubmit(onSignUp)}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                placeholder="Your full name"
                {...register("name")}
              />
            </FormControl>
            <FormControl id="email" isRequired mt={4}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
            </FormControl>
            <FormControl id="password" isRequired mt={4}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Create a password"
                {...register("password")}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              fontSize="md"
              width="full"
              mt={4}
            >
              Sign Up
            </Button>
          </form>
        </Box>
      </Flex>
    </Flex>
  );
};

export default SignUpPage;
