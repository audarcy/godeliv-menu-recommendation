import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import React, { Fragment } from 'react'; 
import Home from './Home';
import LoanForm from './LoanForm';
import LoanResult from './LoanResult';
import RecommendationForm from './RecommendationForm'
import Recommendation from './Recommendation'
import SignIn from './Login';
import Register from './Register';
import UserList from './UserList';

const PrivateRoute = ({ element }) => {
  const token1 = sessionStorage.getItem('token1');
  const token2 = sessionStorage.getItem('token2');

  // Redirect to sign-in if tokens are not present
  if (!token1 && !token2) { // Check for falsiness instead of comparing to an empty string
    return <Navigate to="/" />;
  }

  // Render the protected component if tokens are present
  return element;
};

const App = () => {
  return (
    <ChakraProvider>
      <CSSReset />
      <Box textAlign="center" fontSize="xl" bg="D6E8E0" minHeight="100vh">
        <Router>
          <Fragment>
            <Routes>
            <Route 
              path="/home" 
              element={<Home />} 
            />
            <Route
              path="/loan-recommendation"
              element={<PrivateRoute element={<LoanForm />} />}
            />
            <Route
              path="/loan"
              element={<PrivateRoute element={<LoanResult />} />}
            />
            <Route
              path="/food-recommendation"
              element={<PrivateRoute element={<RecommendationForm />} />}
            />
            <Route
              path="/recommendation"
              element={<PrivateRoute element={<Recommendation />} />}
            />
            <Route path="/user-list" element={<UserList />} />
            <Route 
              path="/" 
              element={<SignIn />} 
            />
            <Route 
              path="/register" 
              element={<Register />} 
            />
            </Routes>
          </Fragment>
        </Router>
      </Box>
    </ChakraProvider>
    
    
  );
}

export default App;
