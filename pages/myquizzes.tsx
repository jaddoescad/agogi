import { getMyQuizzes } from '../utils/supabase-client';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Button, Image, Center, Flex } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

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
      <Flex minH="screen" direction="column" alignItems="center" textColor="black">
        <Head>
          <title>My Quizzes</title>
        </Head>

        <Text fontSize="4xl" fontWeight="bold" mt={4}>My Quizzes</Text>

        <Flex direction="column" alignItems="center" justifyContent="center" mt={10} maxW="6xl" fontWeight="semibold">
          {quizzes.map((quiz) => (
            <Link href={`/quiz/${quiz.id}`}>
              <Flex
                key={quiz.id}
                m={2}
                h="64"
                w="64"
                direction="column"
                alignItems="center"
                justifyContent="space-between"
                borderRadius="3xl"
                p={5}
                bg="#162457"
                color="white"
                _hover={{cursor: "pointer"}}
              >
                <Box
                  fontWeight="bold"
                  mb={2}
                  w="full"
                  rounded="full"
                  p={2}
                  textAlign="center"
                  bg="green"
                >
                  True or False
                </Box>

                <Text mb={2} textAlign="center" fontSize="lg">
                  {quiz.title}
                </Text>

                <Flex w="full" justifyContent="space-between" fontSize="sm">
                  <Box
                    p={2}
                    py={1}
                    rounded="full"
                    bg="red"
                  >
                    {quiz.difficulty}
                  </Box>
                  <Flex alignItems="center" bg="blue.800" p={2} py={1} rounded="full">
                    <CheckCircleIcon mr={2} />
                    {0}
                  </Flex>
                </Flex>
              </Flex>
            </Link>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
};

export default MyQuizzes;
