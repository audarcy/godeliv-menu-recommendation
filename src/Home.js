import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Flex,
  Box,
  Heading,
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
} from '@chakra-ui/react';
import { HamburgerIcon} from '@chakra-ui/icons';

const Links = [ 'Home', 'Food-Recommendation', 'Loan-Recommendation'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const Home = () => {
  const [token1, setToken1] = useState('');
  const [username, setUsername] = useState('');
  const [menus, setMenus] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure()

  const bgColor = useColorModeValue('#018ABE', 'teal.900');

  useEffect(() => {
    const storedToken1 = sessionStorage.getItem('token1');
    setToken1(storedToken1 || ''); // Jika tidak ada token, gunakan string kosong

    const storedUsername = sessionStorage.getItem('username');
    setUsername(storedUsername || ''); // Jika tidak ada token, gunakan string kosong
    // Fetch menu data
    axios.get('https://menurecommend.azurewebsites.net/get_menu', {
      headers: {
        Authorization: `Bearer ${token1}`, // Include the token in the request headers
      },
    })
      .then(response => {
        setMenus(response.data);
      })
      .catch(error => {
        console.error('Error fetching menus:', error);
      });
  }, [token1]);

  const SignOut = () => {
    sessionStorage.setItem('token1', '');
    sessionStorage.setItem('token2', '');
  };

  return (
    <Box>
      {token1 ? (
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
      ) : null}

      <Flex
        align={'center'}
        justify={'center'}
        textAlign="center"
        mt={token1 ? 0 : 10}
        mx={10}
      ></Flex>

      <Stack align={'center'} justify={'center'} textAlign="center" mt={token1 ? 0 : 10} mx={10}>
        {/* Main content */}
        {token1 ? (
          <Box margin="auto">
            <Heading fontSize={'4xl'} mb={4} mt={4} color={'#018ABE'}>
              Menu List
            </Heading>
            <SimpleGrid spacing={4} mt={5} mb={7} columns={[1, null, 3]}>
              {/* Display menus as cards */}
              {menus.map(menu => (
                <Card key={menu.id_menu}>
                  <CardHeader fontSize={'16px'} fontWeight={'700'} color={'#018ABE'}>
                    {menu.nama_menu}
                  </CardHeader>
                  <CardBody fontSize={'14px'} fontWeight={'600'} color={'#02457A'}>
                    <Text>Kalori: {menu.kalori}</Text>
                    <Text>Harga: {menu.harga}</Text>
                    {/* Add more details as needed */}
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        ) : (
          <p>You do not have access. Please log in first.</p>
        )}
      </Stack>
    </Box>
  );
};

export default Home;

