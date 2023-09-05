import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  RadioGroup,
  Radio,
  Button,
  Text,
  Progress,
  Flex,
  Center
} from '@chakra-ui/react';
import Navbar from 'components/ui/Navbar/Navbar';
import { RenderContent } from 'components/RenderContent';
import { getQuestions } from 'utils/supabase-client';
import { Question } from 'types/types';
import { Spinner } from '@chakra-ui/react';

export default function PreviewQuiz({
  quizId,
  topics,
  title,
  selectedTopic,
  setSelectedTopic,
  questions,
}) {
  const [answers, setAnswers] = useState<(boolean | string)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleChange = (index: number, value: string | boolean) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    if (questions[index].correctAnswer.toString() === value) {
      setFeedback('Correct');
    } else {
      setFeedback('Incorrect');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    // Reset feedback when navigating
    setFeedback(null);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    setFeedback(null);
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleReset = () => {
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
    setFeedback(null); // reset feedback
  };

  return (
    <Flex minWidth={'1000px'}>
      <SideBar
        topics={topics}
        onTopicClick={setSelectedTopic}
        selectedTopic={selectedTopic}
      />
      <Box w="100%" bg="gray.900" color="white">
        <Navbar quizTitle={title} quizPreviewTitle />

        <Box h="calc(100vh - 60px)" margin={'auto'} maxW={'600px'} w={'100%'}>
          {questions && questions.length > 0 ? (
            <Box pt={14}>
              <Progress value={progress} size="md" colorScheme="blue" mb={4} />

              <Box
                border="1px"
                p={4}
                mb={2}
                w="100%"
                borderRadius="lg"
                bg="gray.800"
                boxShadow="md"
              >
                <Text fontSize="lg" color="white">
                  <RenderContent
                    content={`${questions[currentQuestionIndex].question}`}
                  />
                </Text>
                <Text
                  mt={2}
                  fontSize="md"
                  color={feedback === 'Correct' ? 'green.500' : 'red.500'}
                >
                  {feedback}
                </Text>
                {submitted && (
                  <Text
                    mt={2}
                    fontSize="md"
                    color={
                      questions[
                        currentQuestionIndex
                      ].correctAnswer.toString() ===
                      answers[currentQuestionIndex]
                        ? 'green.500'
                        : 'red.500'
                    }
                  >
                    Correct answer:{' '}
                    {
                      questions[currentQuestionIndex].choices[
                        questions[currentQuestionIndex].correctAnswer
                      ]
                    }
                  </Text>
                )}

                <RadioGroup
                  mt={4}
                  onChange={(value) =>
                    handleChange(currentQuestionIndex, value)
                  }
                  value={answers[currentQuestionIndex]}
                  display={'flex'}
                  flexDir={'column'}
                >
                  {questions[currentQuestionIndex]?.choices?.map(
                    (choice, index) => {
                      return (
                        <Box key={index}>
                          <RadioButtonWrapper
                            value={index.toString()} // Convert index to string to comply with RadioGroup expectations
                            currentAnswer={answers[currentQuestionIndex]}
                            onChange={(val) =>
                              handleChange(currentQuestionIndex, val)
                            }
                            isDisabled={submitted}
                            label={choice}
                          />
                        </Box>
                      );
                    }
                  )}
                </RadioGroup>
              </Box>
              <Flex justifyContent="space-between">
                <Button
                  mt={4}
                  mx={2} // added margin for separation
                  display={'block'}
                  bg="blue.500"
                  color="white"
                  rounded={'true'}
                  onClick={handlePreviousQuestion}
                  isDisabled={currentQuestionIndex === 0 || submitted} // disable if it's the first question or quiz is submitted
                >
                  Back
                </Button>
                <Button
                  mt={4}
                  mx={2}
                  display={'block'}
                  bg="blue.500"
                  color="white"
                  rounded={'true'}
                  onClick={!submitted ? handleNextQuestion : handleReset}
                >
                  {!submitted ? 'Next' : 'Try Again'}
                </Button>
              </Flex>
            </Box>
          ) : (
            <Text>No questions available.</Text>
          )}
        </Box>
      </Box>
    </Flex>
  );
}

function RadioButtonWrapper({
  value,
  currentAnswer,
  onChange,
  isDisabled,
  label
}) {
  return (
    <Box
      border="1px solid"
      p={4}
      mb={2}
      w="100%"
      borderRadius="lg"
      bg={currentAnswer === value ? 'gray.700' : 'gray.800'}
      boxShadow="md"
      onClick={() => !isDisabled && onChange(value)}
      role="group"
      display={'flex'}
      _hover={{ bg: 'gray.750' }}
      cursor={'pointer'}
      my="2"
    >
      <Radio
        value={value}
        size="lg"
        colorScheme="blue"
        isChecked={currentAnswer === value}
      />
      <Text
        fontSize="lg"
        color="white"
        ml="2"
        _groupHover={{ textDecoration: 'underline' }}
      >
        {label}
      </Text>
    </Box>
  );
}

import { IconButton, Link } from '@chakra-ui/react';
import { IoIosArrowBack } from 'react-icons/io';
import Logo from '@/components/icons/Logo';

export const SideBar = ({ topics, onTopicClick, selectedTopic }) => {
  const handleTopicClick = (id: string) => {
    onTopicClick(id);
  };

  return (
    <Box h={'100vh'} w={'350px'} overflow={'auto'} bg={'#0C0D0F'}>
      <Link href="/" aria-label="Back to Quizzes" color="white">
        <Flex
          align="center"
          p="5"
          _hover={{
            textDecoration: 'none'
          }}
          cursor={'pointer'}
        >
          <Logo />
          <Text fontSize="md" fontWeight="medium" ml="2" mr="1">
            {`AGOGI`}
          </Text>
          {/* <Text fontSize="md">{`- AI Generated Quizzes`}</Text> */}
        </Flex>
      </Link>
      {topics.map((topic, index) => (
        <Button
          key={topic.id}
          pl={6}
          py={8}
          color="white"
          bg={selectedTopic === topic.id ? 'teal' : 'transparent'}
          onClick={() => handleTopicClick(topic.id)}
          _hover={{ bg: selectedTopic === topic.id ? 'teal' : 'gray.700' }}
          // _active={{ bg: 'gray.700' }}
          w="100%"
          justifyContent="flex-start"
        >
          {topic.title}
        </Button>
      ))}
    </Box>
  );
};
