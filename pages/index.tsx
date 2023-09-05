import { getHomePageQuizzes } from 'utils/supabase-client';
import Head from 'next/head';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Center
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { generateQuizID } from '../utils/generate-quiz-id';
import Navbar from 'components/ui/Navbar';
import { QuizCard } from 'components/QuizCards/QuizCard';

type Quiz = {
  id: string;
  title: string | null;
};

const Home: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getHomePageQuizzes();
      setQuizzes(result);
    };

    fetchData();
  }, []);

  return (
    <Box pb={10}>
      <Box minH="screen" alignItems="center">
        <Head>
          <title>Agogi</title>
        </Head>

        <Navbar logo />

        <Box alignItems="center" justifyContent="center" w="full">
          {/* <Box
            w="full"
            h="60vh"
            bgImage="url('https://storage.googleapis.com/pai-images/0808001b73554f73b2ee19b7ad9a421f.jpeg')"
            bgSize="cover"
            bgPos="center"
            pos="relative"
          >
            <Box pos="absolute" w="full" h="full" bg="blackAlpha.500" />
            <Center
              pos="absolute"
              w="100%"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
            >
              <VStack spacing={4} align="center" color="white" w={'100%'}>
                <Text fontSize={['3xl', '5xl']}>AI Generated Quizzes</Text>
                <Link href={'/quizzes'}>
                  <Button colorScheme="blue" px={4}>
                    Generate
                  </Button>
                </Link>
              </VStack>
            </Center>
          </Box> */}
          {quizzes && quizzes.length > 0 ? (
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
              <Text fontSize="3xl" fontWeight="bold" mb={5}>
                Popular Quizzes
              </Text>
              <Box
                mt={4}
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="center"
              >
                {quizzes.map((quiz) => (
                  <Link href={`/quiz/${quiz.id}`}>
                    <Box>
                      <QuizCard quiz={quiz} key={quiz.id} />
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
