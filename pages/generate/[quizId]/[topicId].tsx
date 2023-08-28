import React, { useState } from 'react';
import Form from '../../../components/ChatInterface/Form';
import QuizPage from '../../../components/ChatInterface/Quiz';
import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  getMessages,
  getQuizQuestions,
  getQuizAndTopics
} from 'utils/supabase-client';
import { Question, Message } from 'types/types';
import Navbar from 'components/ui/Navbar';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { withPageAuth } from '@/utils/supabase-server';
import { getURL } from '@/utils/helpers';
import { SideBar } from '../../../components/Topics/Vertical';
import { useGetQuizAndTopics } from 'hooks/useGetQuizAndTopics';

const init_message = {
  message: 'Hello! What type of quiz topic would you like to generate?',
  type: 'ai'
};
export default function Home() {
  const [history, setHistory] = useState<Message[]>([{ ...init_message }]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<string>('gpt-4');
  const quizId = useRouter().query.quizId as string;
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [title, setTitle] = useState<string | null>('Untitled');
  const [currentPage, setCurrentPage] = useState(1);
  const [topics, setTopics] = useState<any[]>([]);

  const {
    data,
    isLoading: isQuizLoading,
    isError
  } = useGetQuizAndTopics(quizId) as {
    data: any;
    isLoading: boolean;
    isError: boolean;
  };

  useEffect(() => {
    if (!quizId) return;
    getMessages(quizId).then((messages) => {
      setHistory([init_message, ...messages]);
    });

    if (data && data.title) {
      setTitle(data.title || ''); // setting title to state if available
    }
    if (data && data.topics_order) {
      const topics = data.topics.filter((topic) =>
        data.topics_order.includes(topic.id)
      );
      
      setTopics(topics);
    }
  }, [quizId, data]);


  return (
    <Flex minWidth={'1000px'}>
      <SideBar topicList={topics} />
      <Box w="full">
        <Navbar
          logoBackToQuizzes
          preview
          share
          quizId={quizId}
          preview_disabled={!questions || questions.length === 0}
          share_disabled={!questions || questions.length === 0}
          share_Url={`${getURL()}preview/${quizId}`}
        />
        <Flex mx="auto" h="calc(100vh - 60px)">
          <Flex
            p={4}
            flexDir={'column'}
            bg="gray.800"
            boxShadow="md"
            maxW={'500px'}
            flex={1}
          >
            <Form
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              history={history}
              setHistory={setHistory}
              quizId={quizId}
              quiz={questions}
              setQuiz={setQuestions}
              setCurrentPage={setCurrentPage}
            />
          </Flex>
          <Flex
            flex={1}
            bg="gray.900"
            alignItems="center"
            justifyContent="center"
            h={'100%'}
          >
            <QuizPage
              questions={questions}
              title={title}
              setTitle={setTitle}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              setQuestions={setQuestions}
            />
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

export const getServerSideProps = withPageAuth(
  { redirectTo: '/signin' },
  async (ctx, supabaseServerClient) => {
    return {
      props: {}
    };
  }
);
