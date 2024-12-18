import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Flex
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons';
import { BiChevronDown } from 'react-icons/bi';
import { FaEdit, FaArchive } from 'react-icons/fa';
import { supabase } from 'utils/supabase-client';

const CustomMenuItem = ({
  icon: Icon,
  href,
  children,
  ...props
}: {
  icon: IconType;
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href}>
    <MenuItem
      {...props}
      transition="background 0.2s, color 0.2s"
      padding="1"
      rounded="md"
      display={'flex'}
      background={'inherit'}
      _hover={{
        backgroundColor: 'violet.500',
        color: 'white'
      }}
      _activeLink={{
        backgroundColor: 'violet.500',
        color: 'white'
      }}
    >
      <Flex>
        <Icon className="mr-2 h-5 w-5 text-violet-200" aria-hidden="true" />
        {children}
      </Flex>
    </MenuItem>
  </Link>
);

export default function Account() {
  return (
    <Box display="inline-block">
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={
            <BiChevronDown
              className="ml-2 -mr-1 h-5 w-5 text-violet-400 hover:text-violet-100"
              aria-hidden="true"
            />
          }
          rounded="md"
          bg="black"
          px="4"
          py="1"
          size="sm"
          fontSize="sm"
          color={'white'}
        >
          Account
        </MenuButton>
        <MenuList
          mt="2"
          w="56"
          rounded="md"
          shadow="lg"
          border="1px"
          borderColor="gray.200"
          zIndex="dropdown"
          backgroundColor={'black'}
          p={'10px'}
        >
          <CustomMenuItem icon={FaEdit} href="/quizzes">
            My Quizzes
          </CustomMenuItem>
          <SignOutButton />
        </MenuList>
      </Menu>
    </Box>
  );
}

const SignOutButton = () => {
  const router = useRouter();

  return (
    <MenuItem
      onClick={async () => {
        await supabase.auth.signOut();
        router.push('/signin');
      }}
      transition="background 0.2s, color 0.2s"
      padding="1"
      backgroundColor={'inherit'}
      rounded="md"
      _hover={{
        backgroundColor: 'violet.500',
        color: 'white'
      }}
      _activeLink={{
        backgroundColor: 'violet.500',
        color: 'white'
      }}
    >
      <FaArchive className="mr-2 h-5 w-5 text-violet-200" aria-hidden="true" />
      Sign Out
    </MenuItem>
  );
};
