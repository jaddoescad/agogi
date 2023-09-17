import React, { useState } from 'react';
import Form from '../../components/ChatInterface/Form';
import QuizPage from '../../components/ChatInterface/Quiz';
import { Box, Button, Flex } from '@chakra-ui/react';
import Router, { useRouter } from 'next/router';
import { useEffect } from 'react';
import {
  getQuestions,
  getQuizAndTopics,
  deleteAllQuestionsOfTopic
} from 'utils/supabase-client';
import { Question, MultipleChoiceQuestion } from 'types/types';
import Navbar from 'components/ui/Navbar';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSideProps, NextApiRequest, NextApiResponse } from 'next';
import { withPageAuth } from '@/utils/supabase-server';
import { getURL } from '@/utils/helpers';
import { SideBar } from '../../components/Topics/Vertical';
import { useGetQuizAndTopics } from 'hooks/useGetQuizAndTopics';
import { checkQuizAndTopicExist } from 'utils/supabase-server';
import { getTopicPrompt } from '../../utils/supabase-client';

const init_message = {
  message: 'Hello! What type of quiz topic would you like to generate?',
  type: 'ai'
};
export default function GenerateQuiz() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<string>('gpt-4');
  const quizId = useRouter().query.quizId as string;
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [title, setTitle] = useState<string | null>('Untitled');
  const [currentPage, setCurrentPage] = useState(1);
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string | null>(null);
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
    if (!selectedTopic) return;
    getQuestions(selectedTopic).then((questions) => {
      setQuestions(questions as MultipleChoiceQuestion[]);
    });

    getTopicPrompt(selectedTopic).then((data) => {
      setPrompt(data.prompt);
    });
  }, [selectedTopic]);

  useEffect(() => {
    if (!data) return;

    if (data.selected_topic) {
      setSelectedTopic(data.selected_topic);
    }

    if (data.title) {
      setTitle(data.title);
    }

    if (data.prompt) {
      setPrompt(data.prompt);
    }

    if (data.topics_order && data.topics) {
      const topics = data.topics.filter((topic: any) =>
        data.topics_order.includes(topic.id)
      );
      setTopics(topics);
    }
  }, [data]);

  return (
    <Flex minWidth={'1000px'}>
      <SideBar
        topicList={topics}
        quizId={quizId}
        topicsOrder={data?.topics_order}
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
      />
      <Box w="full">
        <Navbar
          logoBackToQuizzes
          preview
          share
          quizId={quizId}
          quizTitle={title}
          preview_disabled={!questions || questions.length === 0}
          share_disabled={!questions || questions.length === 0}
          share_Url={`${getURL()}preview/${quizId}`}
          setQuizTitle={setTitle}
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
              quizId={quizId}
              quiz={questions}
              setQuiz={setQuestions}
              setCurrentPage={setCurrentPage}
              topicId={selectedTopic as string}
              prompt={prompt}
              setTopics={setTopics}
              topics={topics}
              
            />
          </Flex>

          <Flex
            flex={1}
            bg="gray.900"
            alignItems="center"
            justifyContent="center"
            h={'100%'}
          >
            <Flex w="100%" color="white" h={'100%'} flexDir={'column'}>
              <Button
                w={'200px'}
                mx={'auto'}
                onClick={async () => {
                  try {
                    if (!selectedTopic) return;
                    await deleteAllQuestionsOfTopic(selectedTopic);
                  } catch (error) {
                    console.error('Failed to delete all questions:', error);
                  } finally {
                    setQuestions([]);
                  }
                }}
              >
                Delete ALL Questions
              </Button>
              <QuizPage
                title={title || 'Untitled'}
                questions={questions || []}
                setTitle={setTitle}
                setQuestions={setQuestions}
              />
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}

export const getServerSideProps = withPageAuth(
  { redirectTo: '/signin' },
  async (ctx, supabaseServerClient) => {
    const quizId = ctx.query.quizId as string;

    if (!quizId) {
      return {
        notFound: true
      };
    }

    const topicsExist = await checkQuizAndTopicExist(
      quizId,
      supabaseServerClient
    );

    if (!topicsExist || topicsExist.length === 0) {
      return {
        notFound: true
      };
    }

    return {
      props: {}
    };
  }
);
