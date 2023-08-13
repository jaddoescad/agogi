import React, { useState } from 'react';
import Form from '../../components/ChatInterface/Form';
import QuizPage from '../../components/ChatInterface/Quiz';
import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getMessages, getQuizQuestions } from 'utils/supabase-client';
import { Question, Message } from 'types/types';

export default function Home() {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentModel, setCurrentModel] = useState<string>('gpt-4');
  const quizId = useRouter().query.quizId as string;
  const [questions, setQuestions] = useState<Question[] | null>(null);

  // Initialize 'history' state from 'localStorage' when the component mounts
  useEffect(() => {
    if (!quizId) return;
    getMessages(quizId).then((messages) => {
      setHistory(messages);
    });

    getQuizQuestions(quizId).then((questions) => {
        console.log("questions",questions)
      setQuestions(questions);
    });
  }, [quizId]);

  return (
    <Flex w="full" mx="auto" h="calc(100vh - 60px)" minWidth={'1000px'}>
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
        />
      </Flex>
      <Flex
        flex={1}
        bg="gray.900"
        alignItems="center"
        justifyContent="center"
        h={'100%'}
      >
        <QuizPage questions={questions} />
      </Flex>
    </Flex>
  );
}
