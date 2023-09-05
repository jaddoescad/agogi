import { useRef, useState } from 'react';
import { postData } from 'utils/helpers';
import {
  Box,
  Button,
  Textarea,
  Flex,
  Text,
  useToast,
  Select
} from '@chakra-ui/react';
import { clearChatMessages } from 'utils/supabase-client';
import { Question, Message } from 'types/types';
import { css_scroll } from 'styles/chakra-css-styles.js';
import {HUMAN_USER} from '../../utils/constants'
import { useEffect } from 'react';

const Form = ({
  isLoading,
  setIsLoading,
  history,
  setHistory,
  quizId,
  topicId,
  quiz,
  setQuiz,
  setCurrentPage
}: {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  history: Message[];
  setHistory: React.Dispatch<React.SetStateAction<Message[]>>;
  quizId: string;
  quiz: any | null;
  setQuiz: React.Dispatch<React.SetStateAction<Question[] | null>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  topicId: string;
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
  const [quizType, setQuizType] = useState<string>('multiple-choice');
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      const chatBox = chatBoxRef.current;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [history]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default behavior of form submission
    e.preventDefault();
    setIsLoading(true);
    const message = messageInput.current?.value;
    if (message !== undefined) {
      setHistory((prev) => [...prev, { message: message, type: HUMAN_USER }]);
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
          quizId,
          quizType,
          topicId
        }
      });
      if (response !== undefined) {
        setHistory((prev) => [
          ...prev,
          { message: response['ai_response']['message'], type: 'ai' }
        ]);

        if (response.quiz_response) {
          const newQuestions = quiz
            ? [...quiz, ...response.quiz_response.questions]
            : response.quiz_response.questions;
          setQuiz(newQuestions);
          setCurrentPage(Math.ceil(newQuestions.length / 5));
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
      <Flex justify="space-between" align="center" mb={4}>
        <Select
          defaultValue={quizType}
          w="200px" // Or any width you prefer
          bg="white"
          color="black"
          variant="outline"
          borderColor="gray.400"
          focusBorderColor="blue.500"
          fontWeight={500}
          onChange={(e) => {
            setQuizType(e.target.value);
          }}
          _hover={{ borderColor: 'blue.500' }}
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true/false">True/False</option>
        </Select>
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
        flex={"1"}
        overflowY="scroll"
        css={css_scroll}
        ref={chatBoxRef}  

      >
        {history?.map((item, index) => (
          <Flex
            key={index}
            justify={item.type === 'ai' ? 'flex-start' : 'flex-end'}
            w="100%"
            mt={2}
          >
            <Box
              p={3}
              rounded="lg"
              bg={item.type === 'ai' ? 'blue.500' : 'gray.500'}
              color="white"
              w="50%"
            >
              <Text>{item.message}</Text>
            </Box>
          </Flex>
        ))}
      </Box>

      <form onSubmit={handleSubmit}>
        <Box bg="gray.700" rounded="md" p={4} boxShadow="md" color={'white'}>
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
      </form>
    </>
  );
};

export default Form;
