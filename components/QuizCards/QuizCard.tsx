import Link from 'next/link';
import React from 'react';
import {
  Text,
  Center,
  VStack,
  Box
} from '@chakra-ui/react';

export const QuizCard = ({
  quiz
}: {
  quiz: { id: string; title: string | null; questionCount: number };
}) => {
  return (
    <Link href={`/generate/${quiz.id}`}>
      <Box
        justifyContent="space-between"
        alignItems="center"
        cursor={'pointer'}
        key={quiz.id}
        display={'flex'}
        flexDirection="column"
        borderRadius="3xl"
        p={5}
        m={2}
        bg="#162457"
        as="div"
        h="12rem"
        w="12rem"
      >
        <Text textAlign="center" size="md" color="white" width="100%" fontWeight={'bold'} fontSize={'large'}>
          {quiz.title ?? 'Untitled'}
        </Text>
        
        <Box
          bg="teal.600"
          color="white"
          fontWeight={"extrabold"}
          borderRadius="full"   // this provides maximum roundness
          px={2.5}
          py={1}
        >
          <Text textAlign="center" size="md" fontSize={'sm'}>
            {quiz.questions[0].count ?? 0}
          </Text>
        </Box>
      </Box>
    </Link>
  );
};