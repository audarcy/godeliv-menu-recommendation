import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
  Input,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Button,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  HStack,
  Text,
  MenuDivider,
  useDisclosure,
  Stack,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { HamburgerIcon} from '@chakra-ui/icons';

const Links = [ 'Home', 'Food-Recommendation', 'Loan-Recommendation'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const RecommendationPage = () => {
  const [idUser, setIdUser] = useState('');
  const [recommendedMeals, setRecommendedMeals] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const storedToken1 = sessionStorage.getItem('token1');
  const { isOpen, onOpen, onClose } = useDisclosure()
  const bgColor = useColorModeValue('#018ABE', 'teal.900');
  const [username] = useState('');

  const handleInputChange = (e) => {
    setIdUser(e.target.value);
  };

  const getRecommendation = async () => {
    try {
      const response = await axios.get(`https://menurecommend.azurewebsites.net/get_recommendation?id_user=${idUser}`,{
        headers: {
          Authorization: `Bearer ${storedToken1}`,
        },
      });
      console.log(response);
      setRecommendedMeals(response.data.recommended_meals);
      setUserDetails(response.data.user);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    }
  };

  const getStandardRecommendation = async () => {
    try {
      const response = await axios.get(`https://menurecommend.azurewebsites.net/get_standard_recommendation?id_user=${idUser}`,{
        headers: {
          Authorization: `Bearer ${storedToken1}`,
        },
      });
      console.log(response);
      setRecommendedMeals(response.data.recommended_meals);
      setUserDetails(response.data.user);
    } catch (error) {
      console.error('Error fetching recommendation:', error);
    }
  };

  const SignOut = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

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
    <Box margin="auto" p={4}>
      <Heading fontSize={'4xl'} mb={4} mt={4} color={'#018ABE'}>
        Recommendation Page
      </Heading>

      <FormControl>
        <FormLabel>ID User</FormLabel>
        <Input
          type="number"
          value={idUser}
          onChange={handleInputChange}
          placeholder="Enter ID User"
          required
        />
      </FormControl>

      <Button type="button" bg="#018ABE" mt={4} onClick={getRecommendation} color={'white'}>
        Get Recommendation
      </Button>
      <Text >{'  '}</Text>
      <Button type="button" bg="#018ABE" mt={4} onClick={getStandardRecommendation} color={'white'}>
        Get Standard Recommendation
      </Button>

      {userDetails && (
        <Box mt={4 }>
          <Text fontSize={'18px'} fontWeight={'700'} color={'#018ABE'}>User Details:</Text>
          <Text fontSize={'16px'} fontWeight={'700'} color={'#018ABE'}>ID: {userDetails.id_user}</Text>
          <Text fontSize={'16px'} fontWeight={'700'} color={'#018ABE'}>Nama User: {userDetails.nama_user}</Text>
          {/* Add more user details as needed */}
        </Box>
      )}

<SimpleGrid spacing={4} mt={5} mb={7} columns={[1, null, 3]}>
        {recommendedMeals.map((meal) => (
          <Card key={meal.id_menu}>
            <CardHeader fontSize={'16px'} fontWeight={'700'} color={'#018ABE'}>
              {meal.nama_menu}
            </CardHeader>
            <CardBody fontSize={'14px'} fontWeight={'600'} color={'#02457A'}>
              <Text>Kalori: {meal.kalori}</Text>
              {/* Add more details as needed */}
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
    </Box>
  );
};



export default RecommendationPage;


