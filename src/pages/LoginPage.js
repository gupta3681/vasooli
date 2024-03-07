import React from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Link,
  Divider,
  Image,
  useColorModeValue,
  Text,
  Heading,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form"; // For form handling
import { useNavigate } from "react-router-dom"; // For routing
import { auth } from "../auth/firebase"; // For Firebase authentication
import { signInWithEmailAndPassword } from "firebase/auth"; // For Firebase authentication
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore"; // For Firebase Firestore
import { db } from "../auth/firebase"; // For Firebase Firestore

const LoginPage = () => {
  const { handleSubmit, register } = useForm();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const onClickSignUp = () => {
    navigate("/signup");
  };

  const onLogin = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log(userCredential);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login: ", error);
      // Handle login errors.
    }
  };

  const onGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;

      // Optional: Check if the user already exists in Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // User does not exist, create a new user document in Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName, // User's name from Google account
          email: user.email, // User's email from Google account
          creditScore: 1000, // Add any other user details you might need
          // Add any other user details you might need
        });
        console.log("User profile created in Firestore.");
      } else {
        // User already exists, you can update the document or simply proceed
        console.log("User already exists in Firestore.");
      }

      navigate("/dashboard");
    } catch (error) {
      console.error("Error during Google login: ", error);
      // Handle login errors here.
    }
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      bg={bgColor}
    >
      <Box
        p={8}
        maxWidth="400px"
        width={"full"}
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
      >
        <Box textAlign="center">
          <Text fontSize="small">Vasooli</Text>
        </Box>
        <Box my={4} textAlign="left">
          <form onSubmit={handleSubmit(onLogin)}>
            <FormControl isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />
            </FormControl>
            <FormControl mt={6} isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password")}
              />
            </FormControl>
            <Checkbox mt={6}>I'm not a robot</Checkbox>
            <Button width="full" mt={4} type="submit" colorScheme="teal">
              Log in
            </Button>
          </form>
          <Flex align="center" color="gray.300" mt={4}>
            <Box flex="1">
              <Divider borderColor="currentcolor" />
            </Box>
            <Text mx={2} color="gray.500">
              or
            </Text>
            <Box flex="1">
              <Divider borderColor="currentcolor" />
            </Box>
          </Flex>
          <Button
            onClick={onGoogleLogin}
            width="full"
            mt={4}
            colorScheme="blue"
            variant="outline"
          >
            Sign in with Google
          </Button>
          <Flex justifyContent="space-between" mt={4}>
            <Link color="teal.500">Forgot your password?</Link>
            <Link color="teal.500" onClick={onClickSignUp}>
              Sign up
            </Link>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginPage;
