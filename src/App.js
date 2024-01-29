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
import UserPage from "./pages/Dashboard";
import { getDoc } from "firebase/firestore";
import Dashboard from "./pages/Dashboard";
// Import other pages here...

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          // The user is new, create their document with initial balance
          await setDoc(userRef, {
            email: user.email,
            balance: 0,
            // Add any other initial user details
          });
        } else {
          console.log("User already exists.");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // A component to handle protected routes
  const ProtectedRoute = ({ children }) => {
    if (!currentUser && !loading) {
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
                <Dashboard />
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
