// @ts-nocheck

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
import { getURL } from 'next/dist/shared/lib/utils';

type Quiz = {
  id: string;
  title: string | null;
  topics_order: string[];
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

  const meta = {
    title: 'Agogi',
    description: 'AI powered quiz platform'
  };
  

  return (
    <Box pb={10}>
      <Box minH="screen" alignItems="center">
        <Head>
          <title>{"Agogi"}</title>
          <meta name="robots" content="follow, index" />
          <link href="/favicon.ico" rel="shortcut icon" />
          <meta content={"Quizzes for Books"} name="description" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={
            "Agogi"
          } />
          <meta property="og:description" content={
            "Quizzes for Books"
          } />
          <meta property="og:title" content={
            "Agogi"
          } />
        </Head>

        <Navbar logo />

        <Box alignItems="center" justifyContent="center" w="full">
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
                  <Link
                    href={`/quiz/${quiz.id}/${quiz.quizzes_snapshot[0].topics_order[0]}
                  `}
                  >
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
