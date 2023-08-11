import Link from 'next/link';
import React from 'react';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import {
  Box,
  Heading,
  HStack,
  Text,
  Icon,
  LinkBox,
  LinkOverlay,
  Flex
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const QuizCard = ({
  quiz
}: {
  quiz: { id: string; title: string | null; };
}) => {
  const router = useRouter();
  return (
    <Link
      href={`/quiz/${quiz.id}`}
    >
      <Box as="div" m={2} h="16rem" w="16rem">
        <Box
          cursor={'pointer'}
          key={quiz.id}
          display={'flex'}
          flexDirection="column"
          justifyContent="space-between"
          borderRadius="3xl"
          p={5}
          m={2}
          bg="#162457"
          h={'100%'}
          w={'100%'}
        >
          <Flex
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            h="33%"
            w="full"
          >
            <Box
              w="full"
              borderRadius="full"
              p={2}
              textAlign="center"
              fontWeight="bold"
              bgColor="green.500"
              color="white"
            >
              True or False
            </Box>
          </Flex>

          <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            h="33%"
            w="full"
          >
            <Heading textAlign="center" size="md" color="white" width="100%">
              {quiz.title}
            </Heading>
          </Flex>

          <Flex
            direction="column"
            justifyContent="flex-end"
            alignItems="center"
            h="33%"
            w="full"
          >
            <HStack w="full" justifyContent="space-between" fontSize="sm">
              <HStack
                alignItems="center"
                bg="blue.800"
                p={2}
                py={1}
                color="white"
                borderRadius="full"
              >
                <Icon as={IoMdCheckmarkCircleOutline} mr={2} />
                <Text>{0}</Text>
              </HStack>
            </HStack>
          </Flex>
        </Box>
      </Box>
    </Link>
  );
};
