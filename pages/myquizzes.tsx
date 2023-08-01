import { getMyQuizzes } from '../utils/supabase-client';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Center,
  Flex,
  SimpleGrid
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { Link as ChakraLink } from '@chakra-ui/react';
import { QuizCard } from 'components/QuizCards/QuizCard';
import { withPageAuth } from '@supabase/auth-helpers-nextjs';

type Quiz = {
  id: number;
  title: string;
  difficulty: string | null;
};

const MyQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMyQuizzes();
      setQuizzes(result);
    };

    fetchData();
  }, []);

  return (
    <Box pb={10}>
      <Box minH="screen" alignItems="center">
        <Head>
          <title>Quiz App</title>
        </Head>

        <Box alignItems="center" justifyContent="center" w="full">
          <Center>
            <Text fontSize={['3xl', '5xl']}>My Quizzes</Text>
          </Center>
          <Box
            mt={10}
            maxW="6xl"
            mx="auto"
            textAlign="center"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <SimpleGrid columns={[1, 1, 2, 3, 3]}>
              {quizzes.map((quiz) => (
                <QuizCard quiz={quiz} key={quiz.id} />
              ))}
            </SimpleGrid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MyQuizzes;

export const getServerSideProps = withPageAuth({ redirectTo: '/signin' });
