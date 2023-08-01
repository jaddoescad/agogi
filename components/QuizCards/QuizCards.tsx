import { Box, Button, SimpleGrid, Center } from '@chakra-ui/react';
import { paginateQuizzes } from 'utils/supabase-client';
import { QuizCard } from '@/components/QuizCards/QuizCard';
import React, { useEffect } from 'react';

const QuizCards = ({
  quizzes: initialQuizzes
}: {
  quizzes: { id: number; title: string; difficulty: string | null }[];
}) => {
  const [quizzes, setQuizzes] = React.useState(initialQuizzes);
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(initialQuizzes.length >= 10);

  const loadMore = async () => {
    setLoading(true);
    const newQuizzes = await paginateQuizzes(page + 1);
    if (newQuizzes.length === 0) {
      setHasMore(false);
    } else {
      setQuizzes([...quizzes, ...newQuizzes]);
      setPage(page + 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('quizzes', quizzes);
  }, [quizzes]);

  return (
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
      {' '}
      <SimpleGrid columns={[1, 2, 3]}>
        {quizzes.map((quiz) => (
          <QuizCard quiz={quiz} key={quiz.id} />
        ))}
      </SimpleGrid>
      {hasMore && !loading && (
        <Center w="full" mt={10}>
          <Button colorScheme="blue" onClick={loadMore}>
            Load More
          </Button>
        </Center>
      )}
    </Box>
  );
};

export default QuizCards;
