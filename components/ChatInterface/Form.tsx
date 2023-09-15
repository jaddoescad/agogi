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
import { Question } from 'types/types';
import { css_scroll } from 'styles/chakra-css-styles.js';
import {HUMAN_USER} from '../../utils/constants'
import { useEffect } from 'react';

const Form = ({
  isLoading,
  setIsLoading,
  quizId,
  topicId,
  quiz,
  setQuiz,
  setCurrentPage,
  prompt,
  topics,
  setTopics
}: {
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  quizId: string;
  quiz: any | null;
  setQuiz: React.Dispatch<React.SetStateAction<Question[] | null>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  topicId: string;
  prompt: string | null;
  topics: any[];
  setTopics: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const modifyTitleById = (id: string, newTitle: string) => {
    const sanitizedTitle = newTitle.replace(/['"]/g, '');

    const index = topics.findIndex((topic) => topic.id === id);
    if (index !== -1) {
      const newTopics = [...topics];
      newTopics[index].title = sanitizedTitle;
      setTopics(newTopics);
    }
  };

  const messageInput = useRef<HTMLTextAreaElement | null>(null);
  const handleEnter = (
    e: React.KeyboardEvent<HTMLTextAreaElement> &
      React.FormEvent<HTMLFormElement>
  ) => {
    if (e.key === 'Enter' && !e.shiftKey && isLoading === false) {
      e.preventDefault();
      // setIsLoading(true);
      handleSubmit(e);
    }
  };
  const toast = useToast();
  const [quizType, setQuizType] = useState<string>('multiple-choice');
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default behavior of form submission
    e.preventDefault();
    setIsLoading(true);
    const message = messageInput.current?.value;

    if (!message) {
      return;
    }

    try {
      let response = await postData({
        url: '/api/book-response',
        data: {
          message,
          quizId,
          quizType,
          topicId
        }
      });
      if (response !== undefined) {
        if (response.questions) {
          const newQuestions = quiz
            ? [...quiz, ...response.questions]
            : response.questions;
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
          onClick={async () => {
            let response = await postData({
              url: '/api/generate-title',
              data: {
                prompt,
                quizId,
                quizType,
                topicId
              }
            });

            modifyTitleById(topicId, response);
          }}
        >
          Generate Title
        </Button>
      </Flex>

      <form
        onSubmit={handleSubmit}
        style={{
          ...css_scroll,
          height: '100%'
        }}
      >
        <Flex
          bg="gray.700"
          rounded="md"
          p={4}
          boxShadow="md"
          color={'white'}
          h="100%"
          flexDir={'column'}
        >
          <Textarea
            name="Message"
            placeholder="Type your query"
            ref={messageInput}
            onKeyDown={handleEnter}
            resize="none"
            bg="transparent"
            flex={1}
            border="none"
            focusBorderColor="blue.500"
            mb={3}
            defaultValue={prompt || ''}
          />
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Send
          </Button>
        </Flex>
      </form>
    </>
  );
};

export default Form;


