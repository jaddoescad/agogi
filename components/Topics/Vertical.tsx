import React from 'react';
import { verticalListSortingStrategy } from '@dnd-kit/sortable';

import { Sortable } from './Sortable';
import { Box, Button, Flex, IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { SortableProps, SideBarProps } from 'types/types';
import {
  generateAQuizForEachTopic,
  deleteAllQuizQuestions,
  countTopicsWithNoQuestions
} from 'utils/supabase-client';

export default {
  title: 'Presets/Sortable/Vertical'
};

const props: Partial<SortableProps> = {
  strategy: verticalListSortingStrategy
};

export const SideBar: React.FC<SideBarProps> = ({
  topicList,
  quizId,
  topicsOrder,
  selectedTopic,
  setSelectedTopic
}) => {
  return (
    <Box h={'100vh'} w={'350px'} overflow={'auto'} bg={'#0C0D0F'}>
      <Link href="/quizzes" aria-label="Back to Quizzes" color="white">
        <Flex
          align="center"
          className="s.logo"
          cursor={'pointer'}
          color={'white'}
          paddingTop={'3'}
          paddingLeft={'2'}
        >
          <IconButton
            aria-label="Back"
            icon={<IoIosArrowBack size={'25'} />}
            variant="ghost"
            color={'white'}
            _hover={{ bg: 'transparent' }}
          />

          <Box fontSize="lg" fontWeight="bold">
            AI Quizzes
          </Box>
        </Flex>
      </Link>
      <Button
        onClick={async () => {
          generateAQuizForEachTopic(topicsOrder, quizId);
        }}
      >
        Generate quizzes
      </Button>
      <Button
        onClick={
          async () => {
            countTopicsWithNoQuestions(quizId);
          }
        }
      >
        Count Topics with no questions
      </Button>

      <Button
        onClick={async () => {
          deleteAllQuizQuestions(topicsOrder);
        }}
      >
        Delete ALL QUestions in Books
      </Button>

      <Sortable
        {...props}
        handle
        topics={topicList}
        topicsOrder={topicsOrder}
        quizId={quizId}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
      />
    </Box>
  );
};
