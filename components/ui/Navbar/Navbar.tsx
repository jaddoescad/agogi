import Logo from 'components/icons/Logo';
import { useRouter } from 'next/router';
import { useUser } from 'utils/useUser';
import {
  Box,
  Flex,
  Button,
  Stack,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';

import SearchBar from './SearchBar';
import AccountDropdown from './AccountDropdown';

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}


export default function WithSubnavigation() {
  const { user } = useUser();
  const router = useRouter();

  return (
    <Box>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
        maxW={'6xl'}
        justify="center"
        mx="auto"
      >

        <Flex
          flex={{ base: 1 }}
          justify={{ md: 'start' }}
          align="center"
        >
          <Link href="/" className="s.logo" aria-label="Logo">
            <Logo />
          </Link>

          <Flex flex={'1'} mx={'auto'} maxW={'2xl'} alignItems="center" justifyContent={"center"}>
          <SearchBar />
        </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
        >
          <Button
            as={Button}
            rounded="md"
            bg={'blue.500'}
            px="4"
            py="2"
            size="sm"
            fontSize="sm"
            color={'white'}
            onClick={() => router.push('/generate')}
            display={{ base: 'none', md: 'inline-flex' }}
          >
            Generate
          </Button>
          {user ? (
            <AccountDropdown />
          ) : (
            <Button
              as={Button}
              rounded="md"
              bg={'green.500'}
              px="4"
              py="2"
              size="sm"
              fontSize="sm"
              color={'white'}
              _hover={{
                bg: 'green.300'
              }}
              onClick={() => router.push('/signin')}
            >
              Sign In
            </Button>
          )}
        </Stack>
      </Flex>
    </Box>
  );
}
