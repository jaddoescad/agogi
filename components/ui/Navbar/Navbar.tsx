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
import { publishQuiz } from 'utils/supabase-client';
import { useState } from 'react';
import SearchBar from './SearchBar';
import AccountDropdown from './AccountDropdown';
import { AiFillEye } from 'react-icons/ai';
import { IoIosArrowBack } from 'react-icons/io';
import React, { useRef } from 'react';
import { useClipboard } from '@chakra-ui/react';
import { FiEdit, FiSave } from 'react-icons/fi';
import { updateQuizTitle } from 'utils/supabase-client';
import { HamburgerIcon } from '@chakra-ui/icons';

export default function WithSubnavigation({
  search = false,
  generate = false,
  share = false,
  preview = false,
  logo = false,
  logoBackToQuizzes = false,
  quizId,
  preview_disabled = false,
  share_disabled = false,
  share_Url = null,
  quizTitle,
  setQuizTitle = null,
  quizPreviewTitle,
  sidebarToggle,
  onOpen,
  isOpenNavbar
}: {
  search?: boolean;
  generate?: boolean;
  share?: boolean;
  preview?: boolean;
  logo?: boolean;
  logoBackToQuizzes?: boolean;
  quizId?: string;
  preview_disabled?: boolean;
  share_disabled?: boolean;
  share_Url?: string | null;
  quizTitle?: string | null;
  setQuizTitle?: any;
  quizPreviewTitle?: boolean;
  sidebarToggle?: boolean;
  onOpen?: () => void;
  isOpenNavbar?: boolean;
}) {
  const { user } = useUser();
  const router = useRouter();

  // ...
  const cancelRef = React.useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(quizTitle || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleKeyPress = (e:  React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (quizId) await publishQuiz(quizId);
      alert('Quiz published!');
    } catch (err: any) {
      alert(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTitle = async () => {
    try {
      if (!quizId) return;
      if (!quizTitle) return;
      await updateQuizTitle(quizId, quizTitle); // Assuming the updateQuizTitle requires the quizid and new title
      setInputValue(quizTitle); // Update inputValue with the new title
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update title:', error);
    } finally {
    }
  };

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
          {sidebarToggle && !isOpenNavbar && (
            <IconButton
              aria-label="Confirm Edit"
              icon={<HamburgerIcon color="white" />}
              variant="ghost"
              disabled={preview_disabled}
              _hover={{ bg: 'gray.700' }}
              onClick={onOpen}
            />
          )}
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
              </Flex>
            </Link>
          )}

          {logoBackToQuizzes && (
            <Flex alignItems="center" gap={2}>
              {isEditing ? (
                <Input
                  value={quizTitle || ''}
                  onBlur={handleSaveTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  onKeyDown={handleKeyPress}
                  autoFocus
                />
              ) : (
                <Box>{quizTitle}</Box>
              )}

              <IconButton
                icon={isEditing ? <FiSave /> : <FiEdit />} // you can use a different icon to represent saving
                variant="ghost"
                color={'white'}
                _hover={{ bg: 'gray.600' }}
                onClick={() => setIsEditing(!isEditing)}
                aria-label="Edit Quiz Title"
              />
            </Flex>
          )}

          {quizPreviewTitle && <Box>{quizTitle}</Box>}

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
              icon={<AiFillEye color="white" size={'1.5rem'} />}
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
                  va.track('publish-quiz');
                  console.log('publishing quiz');
                  // handlePublish();
                  router.push(`/settings/${quizId}`);
                }}
                display={{ base: 'none', md: 'inline-flex' }}
              >
                Publish
              </Button>
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
