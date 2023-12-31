import React, { useEffect, useState } from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Import setDoc and doc
import { auth, db } from "./auth/firebase"; // Adjust this path to where your Firebase auth and Firestore are initialized
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import UserPage from "./pages/UserPage";
// Import other pages here...

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is signed in, create or update their document in Firestore
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            email: user.email,
            // Add any other user details you want to store
          },
          { merge: true }
        );
      }
    });

    return () => unsubscribe();
  }, []);

  // A component to handle protected routes
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      // User not logged in, redirect to login page
      return <Navigate to="/login" replace />;
    }
    return children; // User is logged in, render the protected component
  };

  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          {/* More protected routes can be added here */}
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
