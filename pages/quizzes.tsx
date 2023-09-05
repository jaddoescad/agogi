import { getMyQuizzes } from '../utils/supabase-client';
import Head from 'next/head';
import React from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { useState, useEffect } from 'react';
import { Box, SimpleGrid, Text } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { QuizCard } from 'components/QuizCards/QuizCard';
import Navbar from 'components/ui/Navbar/Navbar';
import { withPageAuth } from '@/utils/supabase-server';
import { generateQuizID } from '@/utils/generate-quiz-id';
import { Spinner } from '@chakra-ui/react';
import { createQuizAndTopic } from '@/utils/supabase-client';
import { default_unpublished_img } from 'utils/constants';
import { Image } from '@chakra-ui/react';

type Quiz = {
  id: string;
  title: string | null;
};
import { useRouter } from 'next/router'; // Import the router if you're using Next.js
import { Button, Icon } from '@chakra-ui/react'; // Assuming you're using Chakra UI
import { AddIcon } from '@chakra-ui/icons'; // Importing an add icon from Chakra UI
import Link from 'next/link';

const MyQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // Get the router instance

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getMyQuizzes();
      setQuizzes(result);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar logo />
      <Box pb={10}>
        <Box alignItems="center" justifyContent="center" w="full">
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
            {loading ? (
              <Spinner size="xl" />
            ) : (
              <SimpleGrid columns={[1, 1, 2, 3, 4, 5]} mt={4}>
                <Box
                  border="2px"
                  alignItems="center"
                  cursor={'pointer'}
                  display={'flex'}
                  flexDirection="column"
                  borderRadius="3xl"
                  p={5}
                  m={2}
                  as="div"
                  h="12rem"
                  w="12rem"
                  borderColor="#162457"
                  justifyContent="center"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => {
                    createQuizAndTopic()
                      .then((res) => {
                        router.push(`/generate/${res.quiz_id}`);
                      })
                      .catch((err) => {
                        alert(err.message);
                      });
                  }}
                >
                  <AddIcon size="lg" />
                  <Text>Add Quiz</Text>
                </Box>

                {quizzes.map((quiz) => (
                  <Link
                    href={`/generate/${quiz.id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <Box>
                      <QuizCard quiz={quiz} key={quiz.id} />
                    </Box>
                  </Link>
                ))}
              </SimpleGrid>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MyQuizzes;

export const getServerSideProps = withPageAuth(
  { redirectTo: '/signin' },
  async (ctx, supabaseServerClient) => {
    return {
      props: {}
    };
  }
);
