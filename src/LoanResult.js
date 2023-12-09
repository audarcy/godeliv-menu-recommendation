import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Button,
  HStack,
  useColorModeValue,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuDivider,
  Avatar,
  Text,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormHelperText,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const Links = [ 'Home', 'Food-Recommendation', 'Loan-Recommendation'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const LoanResult = () => {
    const username = sessionStorage.getItem('username');
  const [customerLoanNew, setCustomerLoanNew] = useState({
    loan_amount: 0,
    loan_amount_term: 0,
  });
  const [loanRec, setLoanRec] = useState({});
  const [loanCustomer, setLoanCust] = useState({});
  const storedToken2 = sessionStorage.getItem('token2');
  const { isOpen, onOpen, onClose } = useDisclosure()

  const bgColor = useColorModeValue('#018ABE', 'teal.900');

  useEffect(() => {
    // Implement logic to check username existence using the API
    const checkUsernameExistence = async () => {
      try {
        const response = await axios.get(
          `https://loanrecommendationapi.azurewebsites.net/customers/${username}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken2}`,
            },
          }
        );
        

        setLoanCust(response.data);
        
      } catch (error) {
        // window.location.href = '/recommendation-form';
      }
    };
    checkUsernameExistence();
  }, [username,storedToken2]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://loanrecommendationapi.azurewebsites.net/recommend_loan/${username}`,
        {
            loan_amount: customerLoanNew.loan_amount,
            loan_amount_term: customerLoanNew.loan_amount_term
        },
        {
          headers: {
            Authorization: `Bearer ${storedToken2}`,
            'Content-Type': 'application/json', // Set Content-Type header to application/json
          },
        }
      );
        setLoanRec(response.data);
      // Handle redirect or other actions after successful submission
    } catch (error) {
      console.error('Error submitting customer:', error);
    }
    
  };

  const handleInputChange = (name, value) => {
    setCustomerLoanNew((prevData) => ({
        ...prevData,
        [name]: Number(value),
    }));

    };

    const SignOut = () => {
      sessionStorage.setItem('token1', '');
      sessionStorage.setItem('token2', '');
    };


  if (!loanCustomer) {
    return (
        <div>
          <h1 className="headingL">User Profile</h1>
        </div>
      );
  }

  return (
    <Box>
        <Box bg={bgColor} px={4}>
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <IconButton
              size={'md'}
              icon={<HamburgerIcon />}
              aria-label={'Open Menu'}
              display={{ md: 'none' }}
              onClick={isOpen ? onClose : onOpen}
            />
            <HStack spacing={8} alignItems={'center'}>
              <Box fontSize={'18'} fontWeight={'700'} color={'white'}>SmartMunch</Box>
              <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
                {Links.map((link) => (
                  <Button bg={'#018ABE'} fontSize={'16'} fontWeight={'700'} color={'white'} key={link} as={Link} to={`/${link.toLowerCase()}`} variant="ghost">
                    {link}
                  </Button>
                ))}
               </HStack>
            </HStack>
            <Flex alignItems={'center'}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={
                      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                </MenuButton>
                <MenuList>
                  <Text>Hello, {username}</Text>
                  <MenuDivider />
                  <Link to="/" onClick={SignOut}>Sign Out</Link>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>

          {isOpen ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {Links.map((link) => (
                  <NavLink key={link} to={`/${link.toLowerCase()}`}>{link}</NavLink>
                ))}
              </Stack>
            </Box>
          ) : null}
        </Box>

      <Heading mb={4} mt={4} color={'#018ABE'} fontSize={'4xl'}>Loan Recommendation</Heading>
            <Flex alignItems={'center'} justifyContent={'center'}>
                <table style={{borderCollapse: "inherit", textAlign: "left", border: "1px solid black" }}>
                    <tbody>
                    <tr>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                        <strong>Username:</strong>
                        </td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{loanCustomer.Username}</td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                        <strong>Gender:</strong>
                        </td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{loanCustomer.Gender}</td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                        <strong>Married:</strong>
                        </td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{loanCustomer.Married}</td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                        <strong>Dependents:</strong>
                        </td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{loanCustomer.Dependents}</td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                        <strong>Education:</strong>
                        </td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{loanCustomer.Education}</td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                        <strong>Applicant Income:</strong>
                        </td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{loanCustomer.ApplicantIncome}</td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid black", padding: "8px" }}>
                        <strong>Property Area:</strong>
                        </td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{loanCustomer.Property_Area}</td>
                    </tr>
                    </tbody>
                </table>
            </Flex>
  <Box>
    {Object.keys(loanRec).length !== 0 ? (
      <Flex alignItems={'center'} justifyContent={'center'} mt={10}>
        <table style={{borderCollapse: "inherit", textAlign: "left", border: "1px solid black" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <strong>Default Prediction</strong>
            </td>
            <td style={{ color: loanRec["predicted_class"] === "Default" ? "red" : "inherit" , border: "1px solid black", padding: "8px"}}>
              {loanRec["predicted_class"]}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <strong>Probability of Default</strong>
            </td>
            <td style={{ color: loanRec["predicted_class"] === "Default" ? "red" : "inherit" , border: "1px solid black", padding: "8px"}}>
              {`${(loanRec["probability_of_default"] * 100).toFixed(2)}%`}
            </td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <strong>Interest Rate</strong>
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>{loanRec["InterestRate"]}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <strong>Tenure (Months)</strong>
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>{loanRec["TenureMonths"]}</td>
          </tr>
          <tr>
            <td style={{ border: "1px solid black", padding: "8px" }}>
              <strong>Loan Amount ($)</strong>
            </td>
            <td style={{ border: "1px solid black", padding: "8px" }}>{loanRec["LoanAmount"]}</td>
          </tr>
        </tbody>
      </table>
      </Flex>
    ) : null}
    <Box px={10}>
    <form onSubmit={(e) => handleSubmit(e)} >
      

      <FormControl>
        <FormLabel>Loan Amount ($) </FormLabel>
        <NumberInput
          name="loan_amount"
          min={100}
          value={customerLoanNew.loan_amount}
          isRequired
          onChange={(_, value) => handleInputChange("loan_amount", value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormHelperText>Minimal Loan 100$</FormHelperText>
      </FormControl>

      <FormControl>
        <FormLabel>Loan Period (Month)</FormLabel>
        <NumberInput
          name="loan_amount_term"
          min={10}
          max={360}
          value={customerLoanNew.loan_amount_term}
          isRequired
          onChange={(_, value) => handleInputChange("loan_amount_term", value)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormHelperText>Minimal Loan Term 10 month</FormHelperText>
      </FormControl>

      <Button bg={'#018ABE'} margin="4" type="submit" color={'white'}>
        Submit
      </Button>
    </form>
    </Box>
  </Box>
  </Box>
);
};

export default LoanResult;
