import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import iconImage from './menu.png'; 

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        // const dataForApi = querystring.stringify({
        //     username: username,
        //     password: password,
  
        // });
        const apiUrlLogin1 = `https://menurecommend.azurewebsites.net/signin_user?username=${username}&password=${password}`;
        const apiUrlLogin2 = 'https://loanrecommendationapi.azurewebsites.net/register';

        // const dataForApi1 = new URLSearchParams();
        // dataForApi1.append('username', username);
        // dataForApi1.append('password', password);

        const [response1, response2] = await Promise.all([
            axios.post(apiUrlLogin1, {
                username: username,
                password: password,
            }),
            axios.post(apiUrlLogin2, {
                username: username,
                password: password,
            }),
        ]);
        console.log('Response from API 1:', response1.data.message);
        console.log('Response from API 2:', response2.data.message);
      // Handle the response from the second API if needed
      if (response1.data.message && response2.data.message) {
        alert('Registrasi berhasil!!!');
        navigate('/');
      } else {
        console.log(response1.data, response2.data);
        alert('Registrasi gagal. Coba lagi.');
      }
    } catch (error) {
        if (error.response) {
            // Handle specific HTTP response status codes
            if (error.response.status === 422) {
                // Handle 422 error
                console.log(error.response.data);  // Log the specific error response
                setError('Invalid data. Please check your inputs.');
            } else if (error.response.status === 400) {
                // Handle 400 error
                console.log(error.response.data);  // Log the specific error response
                setError('Bad request. Please check your inputs.');
            } else {
                console.log(error);
                setError('An error occurred. Please try again.');
            }
        } else if (error.request) {
            console.log(error);
            setError('An error occurred while sending the request.');
        } else {
            console.log(error);
            setError('An error occurred. Please try again.');
        }
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6} >
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} color={'#018ABE'}>Welcome to SmartMunch</Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            Your Personalized Food and Loan Recommendation
          </Text>
        </Stack>
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'gray.700')}
          boxShadow={'lg'}
          p={8} 
          align={'center'}
          maxW={'xl'}>
          <img src={iconImage} style={{ width: '120px', height: '120px', marginBottom: '10px' }} alt="Icon" />
          <Stack spacing={4}>
            <Heading fontSize={'2xl'} color={'#018ABE'}>Register</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isRequired>
            <FormLabel color={'#018ABE'} fontSize="16px" fontWeight="500" >Username</FormLabel>
              <Input type="text" value={username} onChange={handleUsernameChange} required />
            </FormControl>
            <FormControl id="password" isRequired mb={4}>
              <FormLabel color={'#018ABE'} fontSize="16px" fontWeight="500">Password</FormLabel>
              <InputGroup>
                <Input type={showPassword ? 'text' : 'password'} value={password} onChange={handlePasswordChange} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10} mt={5}>
            <Button  type="submit"
                bg={'#018ABE'}
                color={'white'}
                _hover={{
                  bg: '#97CADB',
                }}>
                Register
              </Button>
            </Stack>
          </form>
            <Stack align={'center'}>
              <Text fontSize={'md'} color={'gray.600'}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p style={{fontSize:'14px', fontWeight:'400'}} >
                  Already registered?{' '}
                  <Link to="/" style={{color:'#018ABE'}} >
                    Login to your account
                  </Link>
                </p>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Register;
