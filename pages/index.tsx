import QuizCards  from 'components/QuizCards/QuizCards';
import { getHomePageQuizzes } from 'utils/supabase-client';
import Head from 'next/head';
import { Box, VStack, HStack, Text, Button, Image, Center } from '@chakra-ui/react';
import React, { useState, useEffect} from 'react';
import Link from 'next/link';


type Quiz = {
  id: number;
  title: string;
  difficulty: string | null;
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

        <Box alignItems="center" justifyContent="center" w="full">
          <Box 
            w="full" 
            h="60vh"
            bgImage="url('https://storage.googleapis.com/pai-images/0808001b73554f73b2ee19b7ad9a421f.jpeg')" 
            bgSize="cover" 
            bgPos="center" 
            pos="relative"
          >
            <Box pos="absolute" w="full" h="full" bg="blackAlpha.500" />
            <Center pos="absolute" w="100%" top="50%" left="50%" transform="translate(-50%, -50%)">
              <VStack spacing={4} align="center" color="white" w={"100%"}>
                <Text fontSize={["3xl", "5xl"]}>
                  AI Generated Quizzes
                </Text>
                <Link href="/generate">
                  <Button colorScheme="blue" px={4}>
                    Generate
                  </Button>
                </Link>
              </VStack>
            </Center>

          </Box>
          {quizzes && quizzes.length > 0
           && <QuizCards quizzes={quizzes} />}

        </Box>
      </Box>
    </Box>
  );
};

export default Home;
