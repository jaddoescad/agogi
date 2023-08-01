// // import { useSupabase } from '@/app/providers/supabase-provider';
// import { Menu, Transition } from '@headlessui/react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import { Fragment } from 'react';
// import { IconType } from 'react-icons';
// import { BiChevronDown } from 'react-icons/bi';
// import { FaEdit, FaCopy, FaArchive } from 'react-icons/fa';

// const MenuItem = ({
//   icon: Icon,
//   href,
//   children,
//   ...props
// }: {
//   icon: IconType;
//   href: string;
//   children: React.ReactNode;
// }) => (
//   <Menu.Item {...props}>
//     {({ active }) => (
//       <Link href={href}>
//         <button
//           className={`${
//             active ? 'bg-violet-500 text-white' : 'text-gray-900'
//           } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
//         >
//           <Icon
//             className={`mr-2 h-5 w-5 ${
//               active ? 'text-violet-400' : 'text-violet-200'
//             }`}
//             aria-hidden="true"
//           />
//           {children}
//         </button>
//       </Link>
//     )}
//   </Menu.Item>
// );

// export default function Example() {
//   return (
//     <Menu as="div" className="relative inline-block text-left bg-black">
//       <div>
//         <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
//           Account
//           <BiChevronDown
//             className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
//             aria-hidden="true"
//           />
//         </Menu.Button>
//       </div>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
//           <div className="px-1 py-1">
//           <MenuItem icon={FaEdit} href="/generated">
//               My Quizzes
//             </MenuItem>
//             {/* <MenuItem icon={FaEdit} href="/account">
//               Profile
//             </MenuItem>
//             <MenuItem icon={FaCopy} href="/pricing">
//               Pricing
//             </MenuItem> */}
//           </div>
//           <div className="px-1 py-1">
//             <SignOutButton /> {/* Use SignOutButton */}
//           </div>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   );
// }

// const SignOutButton = () => {
//   const router = useRouter();
// //   const { supabase } = useSupabase();

//   return (
//     <Menu.Item>
//       {({ active }) => (
//         <button
//           onClick={async () => {
//             // await supabase.auth.signOut();
//             router.push('/signin');
//           }}
//           className={`${
//             active ? 'bg-violet-500 text-white' : 'text-gray-900'
//           } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
//         >
//           <FaArchive
//             className={`mr-2 h-5 w-5 ${
//               active ? 'text-violet-400' : 'text-violet-200'
//             }`}
//             aria-hidden="true"
//           />
//           Sign Out
//         </button>
//       )}
//     </Menu.Item>
//   );
// };


import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconType } from 'react-icons';
import { BiChevronDown } from 'react-icons/bi';
import { FaEdit, FaArchive } from 'react-icons/fa';

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
    <MenuItem
      {...props}
      transition="background 0.2s, color 0.2s"
      padding="1"
      rounded="md"
      _hover={{
        backgroundColor: 'violet.500',
        color: 'white',
      }}
      _activeLink={{
        backgroundColor: 'violet.500',
        color: 'white',
      }}
    >
      <Link href={href}>
        <Box>
          <Icon className="mr-2 h-5 w-5 text-violet-200" aria-hidden="true" />
          {children}
        </Box>
      </Link>
    </MenuItem>
  );
  

export default function Account() {
  return (
    <Box display="inline-block">
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<BiChevronDown className="ml-2 -mr-1 h-5 w-5 text-violet-400 hover:text-violet-100" aria-hidden="true" />}
          rounded="md"
          bg="black"
          px="4"
          py="2"
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
        >
          <CustomMenuItem icon={FaEdit} href="/generated">
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
  const supabaseClient = useSupabaseClient();

  return (
    <MenuItem
      onClick={async () => {
        await supabaseClient.auth.signOut();
        router.push('/signin');
      }}
      transition="background 0.2s, color 0.2s"
      padding="1"
      rounded="md"
      _hover={{
        backgroundColor: 'violet.500',
        color: 'white',
      }}
      _activeLink={{
        backgroundColor: 'violet.500',
        color: 'white',
      }}
    >
      <FaArchive className="mr-2 h-5 w-5 text-violet-200" aria-hidden="true" />
      Sign Out
    </MenuItem>
  );
};
