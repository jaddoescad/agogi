import Link from 'next/link';
import React from 'react';
import { Text, Center, VStack, Box } from '@chakra-ui/react';
import { default_unpublished_img } from 'utils/constants';
import { Image } from '@chakra-ui/react';

export const QuizCard = ({
  quiz
}: {
  quiz: {
    id: string;
    title: string | null;
    questionCount: number;
    topicId: string;
    selected_topic: string;
    image_url?: string; // Add this if it's not already in your quiz type
  };
}) => {
  return (
    // <Link href={`/generate/${quiz.id}`}>
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
        w="12rem"
      >
        <Image
          src={quiz.image_url ?? default_unpublished_img}
          alt={quiz.title ?? 'Untitled'}
          objectFit="cover"
          borderRadius="l"
          mb={3}
          flex={1}
        />
        <Text
          textAlign="center"
          size="md"
          color="white"
          width="100%"
          fontWeight={'bold'}
          fontSize={'large'}
        >
          {quiz.title ?? 'Untitled'}
        </Text>
      </Box>
    // </Link>
  );
};