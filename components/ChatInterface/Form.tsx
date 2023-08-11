import { useEffect, useRef, useState } from 'react';
import { postData } from 'utils/helpers';
import { Box, Button, Textarea, Flex, Text, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { getMessages, clearChatMessages } from 'utils/supabase-client';
import QuizPage from './Quiz';
import { QuizRow, QuestionData } from 'types';

const css_scroll = {
  '&::-webkit-scrollbar': {
    width: '4px'
  },
  '&::-webkit-scrollbar-track': {
    width: '6px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'gray',
    borderRadius: '24px'
  }
};

const Form = ({
  isLoading,
  setIsLoading,
  currentModel,
  setCurrentModel,
  history,
  setHistory,
  quizId,
  quiz,
  setQuiz
}: {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  currentModel: string;
  setCurrentModel: React.Dispatch<React.SetStateAction<string>>;
  history: { message: string; type: 'user' | 'bot' }[];
  setHistory: React.Dispatch<
    React.SetStateAction<{ message: string; type: 'user' | 'bot' }[]>
  >;
  quizId: string;
  quiz: any | null;
  setQuiz: React.Dispatch<React.SetStateAction<QuizRow | null>>;
}) => {
  const messageInput = useRef<HTMLTextAreaElement | null>(null);
  const handleEnter = (
    e: React.KeyboardEvent<HTMLTextAreaElement> &
      React.FormEvent<HTMLFormElement>
  ) => {
    if (e.key === 'Enter' && isLoading === false) {
      e.preventDefault();
      // setIsLoading(true);
      handleSubmit(e);
    }
  };
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const message = messageInput.current?.value;
    if (message !== undefined) {
      setHistory((prev) => [...prev, { message: message, type: 'user' }]);
      messageInput.current!.value = '';
    }

    if (!message) {
      return;
    }

    try {
      let response = await postData({
        url: '/api/gpt-response',
        data: {
          message,
          currentModel,
          quizId
        }
      });
      if (response !== undefined) {
        setHistory((prev) => [
          ...prev,
          { message: response['ai_response']['message'], type: 'bot' }
        ]);

        if (response.quiz_response) {
          console.log(response.quiz_response)
          const newQuestions = quiz
            ? [...quiz, ...response.quiz_response.questions]
            : response.quiz_response.questions;
          console.log(newQuestions)
          setQuiz(newQuestions);
        }
      } else {
        throw new Error("Couldn't get response from API.");
      }
    } catch (error) {
      toast({
        title: 'Error.',
        description: String(error),
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    } finally {
      // Hide overlay when done loading
      setIsLoading(false);
    }
  };

  return (
    <>
      <Flex justify="flex-end" mb={4}>
        <Button
          type="reset"
          p={4}
          rounded="md"
          bg="white"
          colorScheme="gray"
          variant="outline"
          _hover={{ bg: 'gray.700' }}
          isDisabled={isLoading}
          onClick={async () => {
            await clearChatMessages(quizId);
            setHistory([]);
            setQuiz(null);
          }}
        >
          Clear History
        </Button>
      </Flex>

      <Box
        w="full"
        alignItems="flex-start"
        mb={6}
        h="500"
        p={4}
        overflowY="scroll"
        css={css_scroll}
      >
        {history?.map((item, index) => (
          <Flex
            key={index}
            justify={item.type === 'user' ? 'flex-start' : 'flex-end'}
            w="100%"
            mt={2}
          >
            <Box
              p={3}
              rounded="lg"
              bg={item.type === 'user' ? 'blue.500' : 'gray.500'}
              color="white"
              w="50%"
            >
              <Text>{item.message}</Text>
            </Box>
          </Flex>
        ))}
      </Box>

      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="gray.700"
        rounded="md"
        p={4}
        boxShadow="md"
        color={'white'}
      >
        <Textarea
          name="Message"
          placeholder="Type your query"
          ref={messageInput}
          onKeyDown={handleEnter}
          resize="none"
          bg="transparent"
          border="none"
          focusBorderColor="blue.500"
          mb={3}
        />
        <Button type="submit" colorScheme="blue" isLoading={isLoading}>
          Send
        </Button>
      </Box>
    </>
  );
};

export default Form;
