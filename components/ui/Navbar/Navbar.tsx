import Logo from 'components/icons/Logo';
import { useRouter } from 'next/router';
import { useUser } from 'utils/useUser';
import {
  Box,
  Flex,
  Button,
  Stack,
  Text,
  useColorModeValue,
  IconButton,
  Input
} from '@chakra-ui/react';
import Link from 'next/link';
import va from '@vercel/analytics';

import SearchBar from './SearchBar';
import AccountDropdown from './AccountDropdown';
import { AiFillEye } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { useState } from 'react';
import React, { useRef } from 'react';
import { useClipboard } from '@chakra-ui/react';

export default function WithSubnavigation({
  search = false,
  generate = false,
  share = false,
  preview = false,
  logo = false,
  logoBackToQuizzes = false,
  quizId = null,
  preview_disabled = false,
  share_disabled = false,
  share_Url = null
}: {
  search?: boolean;
  generate?: boolean;
  share?: boolean;
  preview?: boolean;
  logo?: boolean;
  logoBackToQuizzes?: boolean;
  quizId?: string | null;
  preview_disabled?: boolean;
  share_disabled?: boolean;
  share_Url?: string | null;
}) {
  const { user } = useUser();
  const router = useRouter();

  // ...
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef();
  const { hasCopied, onCopy } = useClipboard(share_Url);

  return (
    <Box>
      <Flex
        bg={'gray.700'}
        color={'white'}
        minH={'60px'}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={'center'}
        justify="center"
        mx="auto"
      >
        <Flex flex={{ base: 1 }} justify={{ md: 'start' }} align="center">
          {logo && (
            <Link href="/" className="s.logo" aria-label="Logo">
              <Flex
                align="center"
                _hover={{
                  textDecoration: 'none'
                }}
                cursor={'pointer'}
              >
                <Logo />
                <Text fontSize="md" fontWeight="medium" ml="2" mr="1">
                  {`AGOGI`}
                </Text>
                <Text fontSize="md">{`- AI Generated Quizzes`}</Text>
              </Flex>
            </Link>
          )}

          {logoBackToQuizzes && (
            <Link href="/quizzes" aria-label="Back to Quizzes">
              <Flex align="center" className="s.logo" cursor={'pointer'}>
                {/* Back Button (Assuming you have a back arrow icon) */}
                <IconButton
                  aria-label="Back"
                  icon={<IoIosArrowBack size={'25'} />}
                  variant="ghost"
                  _hover={{ bg: 'transparent' }}
                />

                <Box fontSize="lg" fontWeight="bold">
                  AI Quizzes
                </Box>
              </Flex>
            </Link>
          )}

          {search && (
            <Flex
              flex={'1'}
              mx={'auto'}
              maxW={'2xl'}
              alignItems="center"
              justifyContent={'center'}
            >
              <SearchBar />
            </Flex>
          )}
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={'flex-end'}
          direction={'row'}
          spacing={6}
          alignItems="center" // Add this line to align items vertically
        >
          {preview && (
            <IconButton
              aria-label="Confirm Edit"
              icon={<AiFillEye size={'1.5rem'} />}
              variant="ghost"
              disabled={preview_disabled}
              _hover={{ bg: 'gray.700' }}
              onClick={() => {
                router.push(`/preview/${quizId}`);
                va.track('preview-quiz');
              }}
            />
          )}
          {generate && (
            <Button
              as={Button}
              rounded="md"
              bg={'blue.500'}
              px="4"
              py="2"
              size="sm"
              fontSize="sm"
              color={'white'}
              onClick={() => {
                router.push('/generate');
                va.track('generate-quiz-clicked');
              }}
              display={{ base: 'none', md: 'inline-flex' }}
            >
              Generate
            </Button>
          )}

          {share && (
            <>
              <Button
                as={Button}
                rounded="md"
                bg={'blue.500'}
                px="4"
                py="2"
                size="sm"
                fontSize="sm"
                color={'white'}
                disabled={share_disabled}
                onClick={() => {
                  setIsOpen(true);
                  va.track('share-quiz');
                }}
                display={{ base: 'none', md: 'inline-flex' }}
              >
                Share
              </Button>

              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Share Quiz Link
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      <Stack spacing={2}>
                        <Text fontWeight="bold">Link</Text>
                        <Input fontWeight={500} value={share_Url} isReadOnly />
                      </Stack>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button colorScheme="blue" onClick={onCopy} ml={3}>
                        {hasCopied ? 'Copied' : 'Copy'}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          )}
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
