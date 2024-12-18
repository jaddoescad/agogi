import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  RadioGroup,
  Radio,
  Button,
  Text,
  Progress,
  Flex,
  Center,
  useBreakpointValue
} from '@chakra-ui/react';
import Navbar from 'components/ui/Navbar/Navbar';
import { useDisclosure } from '@chakra-ui/react';
import { useMediaQuery } from '@chakra-ui/react';
import {
  PreviewQuizProps,
  QuestionNavigationProps,
  RadioButtonWrapperProps,
  ControlButtonsProps
} from 'types/types';
import { Spinner } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { trackVercel } from '@/utils/analytics';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { upvoteORdownvoteQuestion } from '@/utils/supabase-client';

export default function PreviewQuiz({
  quizId,
  topics,
  title,
  selectedTopic,
  setSelectedTopic,
  questions,
  topicTitle,
  topicsOrder,
  feedback,
  setFeedback,
  answers,
  setAnswers,
  submitted,
  setSubmitted,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  isQuestionLoading
}: PreviewQuizProps) {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isSmallerThan768] = useMediaQuery('(max-width: 768px)');
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const router = useRouter();
  const [showFeedbackMessage, setShowFeedbackMessage] = useState(false);

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
    if (questions[index].correctAnswer.toString() === value) {
      setFeedback('Correct');
    } else {
      setFeedback('Incorrect');
    }
  };

  const goToNextTopic = () => {
    if (quizId) trackVercel('Next Chapter', { quizId: quizId });
    const currentIndex = topicsOrder.indexOf(selectedTopic);
    if (currentIndex < topicsOrder.length - 1) {
      router.push(`/quiz/${quizId}/${topicsOrder[currentIndex + 1]}`);
    }
    handleReset();
  };

  const goToPreviousTopic = () => {
    if (quizId) trackVercel('Previous Chapter', { quizId: quizId });
    const currentIndex = topicsOrder.indexOf(selectedTopic);
    if (currentIndex > 0) {
      router.push(`/quiz/${quizId}/${topicsOrder[currentIndex - 1]}`);
    }
    handleReset();
  };

  const handlePreviousQuestion = () => {
    if (quizId) trackVercel('Previous Question', { quizId: quizId });
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    // Reset feedback when navigating
    setFeedback(null);
    handleReset();
  };

  const handleNextQuestion = () => {
    if (quizId) trackVercel('Next Question', { quizId: quizId });
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    setFeedback(null);
    handleReset();
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleReset = () => {
    setAnswers([]);
    setSubmitted(false);
    setFeedback(null);
    setShowFeedbackMessage(false);
  };

  useEffect(() => {
    if (isLargerThan768) onOpen();
    if (isSmallerThan768) onClose();
  }, [isLargerThan768, isSmallerThan768]);

  return (
    <Flex minWidth={['100%', '100%', 'auto']}>
      {isOpen && (
        <Box
          h={'100vh'}
          w={isSmallerThan768 ? '100%' : '350px'}
          overflow={'auto'}
          bg={'#0C0D0F'}
        >
          <SideBar
            topics={topics}
            onTopicClick={setSelectedTopic}
            selectedTopic={selectedTopic}
            onClose={onClose}
            quizId={quizId}
          />
        </Box>
      )}

      {((!isOpen && isSmallerThan768) || isLargerThan768) && (
        <Box
          display="flex"
          flexDir={'column'}
          w="100%"
          bg="gray.900"
          color="white"
          h="100vh"
          overflow={'auto'}
          paddingBottom={'50px'}
        >
          <Navbar
            isOpenNavbar={isOpen}
            quizTitle={title}
            quizPreviewTitle
            sidebarToggle
            onOpen={onOpen}
          />
          {!isQuestionLoading ? (
            <Box w={'100%'} flex={1} p={5}>
              {questions && questions.length > 0 ? (
                <Box margin={['0', 'auto']} maxW={['100%', '600px']} pt={5}>
                  <QuestionNavigation
                    topicTitle={topicTitle}
                    topicsOrder={topicsOrder}
                    selectedTopic={selectedTopic}
                    goToNextTopic={goToNextTopic}
                    goToPreviousTopic={goToPreviousTopic}
                  />

                  <Progress
                    value={progress}
                    size="md"
                    colorScheme="blue"
                    mb={4}
                    mt={4}
                  />

                  <QuestionBox
                    currentQuestion={questions[currentQuestionIndex]}
                    handleChange={handleChange}
                    currentQuestionIndex={currentQuestionIndex}
                    submitted={submitted}
                    feedback={feedback}
                    answers={answers}
                  />
                  <ControlButtons
                    handlePreviousQuestion={handlePreviousQuestion}
                    handleNextQuestion={handleNextQuestion}
                    submitted={submitted}
                    currentQuestionIndex={currentQuestionIndex}
                    questions={questions}
                    handleReset={handleReset}
                    setShowFeedbackMessage={setShowFeedbackMessage}
                    showFeedbackMessage={showFeedbackMessage}
                  />
                </Box>
              ) : (
                <Text>No questions available.</Text>
              )}
            </Box>
          ) : (
            <Center h={'100%'} w={'100%'}>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
              />
            </Center>
          )}
        </Box>
      )}
    </Flex>
  );
}

export const SideBar: React.FC<SideBarProps> = ({
  topics,
  onTopicClick,
  selectedTopic,
  onClose,
  quizId
}) => {
  const [isSmallerThan768] = useMediaQuery('(max-width: 768px)');
  const router = useRouter();

  const handleTopicClick = (id: string) => {
    if (quizId) trackVercel('Topic Click', { quizId: quizId });
    if (isSmallerThan768 === true) onClose();
    router.push(`/quiz/${quizId}/${id}`);
  };

  return (
    <Box h={'100%'} w={'100%'}>
      <Box aria-label="Back to Quizzes" color="white">
        <Flex
          align="center"
          p="5"
          _hover={{
            textDecoration: 'none'
          }}
          cursor={'pointer'}
        >
          <Link href="/">
            <Flex
              align="center"
              _hover={{
                textDecoration: 'none'
              }}
              cursor={'pointer'}
            >
              <Logo />
              <Text fontSize="md" fontWeight="medium" ml="2" mr="1">
                {`AGOGI`}
              </Text>
            </Flex>
          </Link>
          <CloseButton ml="auto" color={'white'} onClick={onClose} />
        </Flex>
      </Box>
      {topics.map((topic, index) => (
        <Box
          key={topic.id}
          pl={6}
          pr={6}
          py={4}
          color="white"
          bg={selectedTopic === topic.id ? 'teal' : 'transparent'}
          onClick={() => handleTopicClick(topic.id)}
          _hover={{ bg: selectedTopic === topic.id ? 'teal' : 'gray.700' }}
          position="relative"
          display="flex"
          flexGrow={1}
          alignItems="center"
          w="100%"
          fontWeight="500"
          fontSize="1rem"
          overflowWrap="break-word"
          justifyContent="flex-start"
        >
          {topic.title}
        </Box>
      ))}
    </Box>
  );
};

const RadioButtonWrapper: React.FC<RadioButtonWrapperProps> = ({
  value,
  currentAnswer,
  onChange,
  isDisabled,
  label
}) => {
  return (
    <Box
      border="1px solid"
      p={[2, 4]}
      mb={[1, 2]}
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
};

import { IconButton, Link } from '@chakra-ui/react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import Logo from '@/components/icons/Logo';
import { CloseButton } from '@chakra-ui/react';

type SideBarProps = {
  topics: any[];
  onTopicClick: (id: string) => void;
  selectedTopic: string | number;
  onClose: () => void;
  va?: any;
  quizId?: string;
};

export const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  topicTitle,
  topicsOrder,
  selectedTopic,
  goToNextTopic,
  goToPreviousTopic
}) => {
  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <Box
        display="flex"
        onClick={goToPreviousTopic}
        flexDirection="column"
        alignItems="center"
        cursor={'pointer'}
      >
        <IconButton
          icon={<IoIosArrowBack />}
          aria-label="Previous Chapter"
          isDisabled={topicsOrder.indexOf(selectedTopic) === 0}
          rounded={'full'}
        />
        <Text
          fontSize={'smaller'}
          fontWeight={'bold'}
          mt={2}
          textAlign="center"
        >
          Previous Chapter
        </Text>
      </Box>
      <Heading as="h1" size="md" m={4} textAlign="center">
        {topicTitle}
      </Heading>
      <Box
        cursor={'pointer'}
        display="flex"
        onClick={goToNextTopic}
        flexDirection="column"
        alignItems="center"
      >
        <IconButton
          icon={<IoIosArrowForward />}
          aria-label="Next Chapter"
          rounded={'full'}
          isDisabled={
            topicsOrder.indexOf(selectedTopic) === topicsOrder.length - 1
          }
        />
        <Text
          fontSize={'smaller'}
          fontWeight={'bold'}
          mt={2}
          textAlign="center"
        >
          Next Chapter
        </Text>
      </Box>
    </Flex>
  );
};

type QuestionBoxProps = {
  currentQuestion: any;
  handleChange: (index: number, value: string) => void;
  currentQuestionIndex: number;
  submitted: boolean;
  feedback: string | null;
  answers: string[];
};

export const QuestionBox: React.FC<QuestionBoxProps> = ({
  currentQuestion,
  handleChange,
  currentQuestionIndex,
  submitted,
  feedback,
  answers
}) => {
  return (
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
        {currentQuestion.question}
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
            currentQuestion.correctAnswer.toString() ===
            answers[currentQuestionIndex]
              ? 'green.500'
              : 'red.500'
          }
        >
          Correct answer:{' '}
          {currentQuestion.choices[currentQuestion.correctAnswer]}
        </Text>
      )}
      <RadioGroup
        mt={4}
        onChange={(value) => handleChange(currentQuestionIndex, value)}
        value={answers[currentQuestionIndex]}
        display={'flex'}
        flexDir={'column'}
      >
        {currentQuestion?.choices.map((choice: string, index: number) => (
          <RadioButtonWrapper
            key={index}
            value={index.toString()}
            currentAnswer={answers[currentQuestionIndex]}
            onChange={(value: any) =>
              handleChange(currentQuestionIndex, value.toString())
            }
            isDisabled={submitted}
            label={choice}
          />
        ))}
      </RadioGroup>
    </Box>
  );
};
export const ControlButtons: React.FC<ControlButtonsProps> = ({
  handlePreviousQuestion,
  handleNextQuestion,
  submitted,
  currentQuestionIndex,
  questions,
  handleReset,
  setShowFeedbackMessage,
  showFeedbackMessage
}) => {
  useEffect(() => {
    setShowFeedbackMessage(false);
  }, []);

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center">
        <Button
          mt={4}
          mx={2}
          bg="blue.500"
          color="white"
          rounded={'true'}
          onClick={handlePreviousQuestion}
          isDisabled={currentQuestionIndex === 0 || submitted}
        >
          Back
        </Button>

        <IconButton
          aria-label="Thumbs Up"
          icon={<FaThumbsUp />}
          m={2}
          colorScheme="green"
          variant="outline"
          onClick={() => {
            upvoteORdownvoteQuestion(
              questions[currentQuestionIndex].id,
              'thumbs_up'
            );
            setShowFeedbackMessage(true);
          }}
        />

        <IconButton
          aria-label="Thumbs Down"
          icon={<FaThumbsDown />}
          m={2}
          colorScheme="red"
          variant="outline"
          onClick={() => {
            upvoteORdownvoteQuestion(
              questions[currentQuestionIndex].id,
              'thumbs_down'
            );
            setShowFeedbackMessage(true);
          }}
        />

        <Button
          mt={4}
          mx={2}
          bg="blue.500"
          color="white"
          rounded={'true'}
          onClick={!submitted ? handleNextQuestion : handleReset}
        >
          {!submitted ? 'Next' : 'Try Again'}
        </Button>
      </Flex>
      {showFeedbackMessage && <p>Thank you for your feedback!</p>}
    </Box>
  );
};
