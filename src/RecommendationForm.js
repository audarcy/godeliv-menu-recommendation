import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate ,Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Select,
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
  Container

} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';


const Links = [ 'Home', 'Food-Recommendation', 'Loan-Recommendation'];

const NavLink = ({ children }) => (
  <Button as={Link} to={'#'}>
    {children}
  </Button>
);

const RecommendationForm = () => {
    const username = sessionStorage.getItem('username');
    const storedToken1 = sessionStorage.getItem('token1');
    const { isOpen, onOpen, onClose } = useDisclosure()
    const storedID = sessionStorage.getItem('userId');
    const navigate = useNavigate();

    // const [popupOpen, setPopupOpen] = useState(false);
    // const [popupUserData, setPopupUserData] = useState(null);

    console.log("ID:" + storedID);

  const [formData, setFormData] = useState({
    id_user:0,
    nama_user: '',
    jenis_kelamin: '',
    umur_user: 0,
    target_kalori: 0,
  });
  
  const generateRandomId = () => {
    return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  };

  const isIdAvailable = async (id_user) => {
    try {
      const response = await axios.get(`https://menurecommend.azurewebsites.net/get_user/${id_user}`, {
        headers: {
          Authorization: `Bearer ${storedToken1}`,
        },
      });
      
      if (response.status){
        return false
      }  // Jika 404, artinya id belum digunakan
    } catch (error) {
      return true;  // Anda dapat menangani error sesuai kebutuhan aplikasi Anda
    }
  };

  const getAvailableId = async () => {
    const maxAttempts = 10;

    for (let i = 0; i < maxAttempts; i++) {
      const randomId = generateRandomId();
      const idAvailable = await isIdAvailable(randomId);

      if (idAvailable) {
        
        return randomId;
      }
    }

    console.error(`Failed to get an available id after ${maxAttempts} attempts`);
    // Handle the failure case as needed for your application
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();

    const randomId = await getAvailableId();

    try {
    //   const response = await axios.post(
    //     `http://menurecommendation.hdbrd0atezbrd6eh.eastus.azurecontainer.io/add_user?id_user=${formData.id_user}&nama_user=${formData.nama_user}&jenis_kelamin=${formData.jenis_kelamin}&umur_user=${formData.umur_user}&target_kalori=${formData.target_kalori}`,
    //     null, // Pass null as the second parameter if you are passing data in the URL
    //     {
    //       headers: {
    //         Authorization: `Bearer ${storedToken1}`,
    //         'Content-Type': 'application/json', // Set Content-Type header to application/json
    //       },
    //     }
    //   );
    await axios.post(
      `https://menurecommend.azurewebsites.net/add_user?id_user=${randomId}&nama_user=${formData.nama_user}&jenis_kelamin=${formData.jenis_kelamin}&umur_user=${formData.umur_user}&target_kalori=${formData.target_kalori}`,
      // Move the data payload here
      {
        id_user: randomId,
        nama_user: formData.nama_user,
        jenis_kelamin: formData.jenis_kelamin,
        umur_user: formData.umur_user,
        target_kalori: formData.target_kalori,
      },
      {
        headers: {
          Authorization: `Bearer ${storedToken1}`,
          'Content-Type': 'application/json',
        },  
      }
    );
  

      // setPopupUserData(response.data); // Assuming the response is an array of user data
      // setPopupOpen(true);

    navigate('/user-list');
    } catch (error) {
      console.error('Error submitting customer:', error);
    }

    // window.location.href = '/recommendation';
  };
    const SignOut = () => {
        sessionStorage.setItem('token1', '');
        sessionStorage.setItem('token2', '');
    };

  const bgColor = useColorModeValue('#018ABE', 'teal.900');

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
        <Container maxW="container.sm" mt={8}>
        <Box p={4} borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading mb={4} mt={4} color={'#018ABE'}>
        Food Recommendation Form
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Nama User</FormLabel>
          <Input
            type="text"
            name="nama_user"
            value={formData.nama_user}
            onChange={handleChange}
            placeholder="Enter Nama User"
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>Jenis Kelamin</FormLabel>
          <Select
            name="jenis_kelamin"
            value={formData.jenis_kelamin}
            onChange={handleChange}
            placeholder="Pilih Jenis Kelamin"
            required
          >
            <option value="Laki-laki">Laki-laki</option>
            <option value="Perempuan">Perempuan</option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Umur User</FormLabel>
          <Input
            type="number"
            name="umur_user"
            value={formData.umur_user}
            onChange={handleChange}
            placeholder="Enter Umur User"
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel>Target Kalori</FormLabel>
          <Input
            type="number"
            name="target_kalori"
            value={formData.target_kalori}
            onChange={handleChange}
            placeholder="Enter Target Kalori"
            required
          />
        </FormControl>

        <Button type="submit" bg="#018ABE" mt={4} mx="auto" color={'white'}>
          Add User Data
        </Button>
      </form>
    </Box>
    </Container>
    </Box>
  );
};

export default RecommendationForm;
