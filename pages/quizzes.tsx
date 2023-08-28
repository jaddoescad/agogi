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

type Quiz = {
  id: string;
  title: string | null;
};
import { useRouter } from 'next/router'; // Import the router if you're using Next.js
import { Button, Icon } from '@chakra-ui/react'; // Assuming you're using Chakra UI
import { AddIcon } from '@chakra-ui/icons'; // Importing an add icon from Chakra UI

const MyQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter(); // Get the router instance

  const handleAddQuiz = () => {
    router.push('/path-to-add-quiz-page'); // Replace with your actual path to the add quiz page
  };

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
                    //                   CREATE OR REPLACE FUNCTION create_quiz_and_topic() RETURNS json AS $$
                    // DECLARE
                    //     quiz_id UUID;
                    //     topic_id UUID;
                    //     current_user_id UUID;
                    // BEGIN
                    //     current_user_id := auth.uid();
                    //     INSERT INTO quizzes (title, user_id) VALUES ('Untitled', current_user_id) RETURNING id INTO quiz_id;
                    //     INSERT INTO topics (title, quiz_id) VALUES ('New Topic', quiz_id) RETURNING id INTO topic_id;

                    //     COMMIT;
                    //     RETURN json_build_object('quiz_id', quiz_id, 'topic_id', topic_id);
                    // END;
                    // $$ LANGUAGE plpgsql;

                    // router.push(`/generate/${generateQuizID()}`);

                    createQuizAndTopic().then((res) => {
                      router.push(`/generate/${res.quiz_id}/${res.topic_id}`);
                    }).catch((err) => {
                      alert(err.message);
                    });
                  }}
                >
                  <AddIcon size="lg" />
                  <Text>Add Quiz</Text>
                </Box>

                {quizzes.map((quiz) => (
                  <QuizCard quiz={quiz} key={quiz.id} />
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
