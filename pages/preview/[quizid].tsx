import { getQuiz } from '../../utils/supabase-server';
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
  Flex
} from '@chakra-ui/react';
import va from '@vercel/analytics';
import Head from 'next/head';
import { getURL } from '@/utils/helpers';
import Navbar from 'components/ui/Navbar/Navbar';
import { RenderContent } from 'components/RenderContent';
import Latex from 'react-latex';

export default function QuizPage(props: { quiz: any }) {
  const [answers, setAnswers] = useState<(boolean | string)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { quizid } = router.query;
  const quiz = props.quiz;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    console.log('quiz', quiz);
  }, [quiz]);
  const handleChange = (index: number, value: string | boolean) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);

    // Provide immediate feedback
    if (
      quiz.questions[index].question_data.correctAnswer.toString() === value
    ) {
      setFeedback('Correct');
    } else {
      setFeedback('Incorrect');
    }
  };

  const handleSubmit = () => {
    va.track('see how you did');
    setSubmitted(true);
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
    // Reset feedback when navigating
    setFeedback(null);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
    setFeedback(null);
  };

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleReset = () => {
    if (!quiz) return;
    setAnswers(Array(quiz.questions.length).fill(null));
    setSubmitted(false);
    setFeedback(null); // reset feedback
  };

  //track quiz views
  useEffect(() => {
    if (quizid) {
      va.track('quiz-view');
    }
  }, [quizid]);

  if (!quiz) {
    return 'Loading...';
  }

  return !quiz ? (
    <Text>Loading...</Text>
  ) : (
    <>
      <Head>
        <title>{quiz.title ?? 'Untitled'} - Quiz</title>
        <meta name="robots" content="follow, index" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <meta
          content={`
          AI Generated Quiz about ${quiz.title}
          `}
          name="description"
        />
        <meta
          property="og:url"
          content={`
          ${getURL()}
          ${router.asPath}`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={`Quiz - ${quiz.title}`} />
        <meta
          property="og:description"
          content={`AI Generated Quiz about ${quiz.title}`}
        />
        <meta property="og:title" content={`Quiz - ${quiz.title} `} />
        <meta name="twitter:title" content={`Quiz - ${quiz.title}`} />
        <meta
          name="twitter:description"
          content={`AI Generated Quiz about ${quiz.title}`}
        />
      </Head>
      <Navbar logo />
      <Box w="100%" bg="gray.900" h="calc(100vh - 60px)" color="white">
        <Box margin={'auto'} marginTop={'70px'} maxW={'600px'} w={'100%'}>
          <Box m={4}>
            <Heading
              as="h1"
              size="2xl"
              textAlign="center"
              my={4}
              opacity={'0.7'}
            >
              {quiz.title ?? 'Untitled'}
            </Heading>

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
                {/* {quiz.questions[currentQuestionIndex].question_data.question} */}
                <RenderContent
                  content={`${quiz.questions[currentQuestionIndex].question_data.question}`}
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
                    quiz.questions[
                      currentQuestionIndex
                    ].question_data.correctAnswer.toString() ===
                    answers[currentQuestionIndex]
                      ? 'green.500'
                      : 'red.500'
                  }
                >
                  Correct answer:{' '}
                  {
                    quiz.questions[currentQuestionIndex].question_data.choices[
                      quiz.questions[currentQuestionIndex].question_data
                        .correctAnswer
                    ]
                  }
                </Text>
              )}

              <RadioGroup
                mt={4}
                onChange={(value) => handleChange(currentQuestionIndex, value)}
                value={answers[currentQuestionIndex]}
                display={'flex'}
                flexDir={'column'}
              >
                {quiz.questions[currentQuestionIndex].question_data.choices.map(
                  (choice, index) => {
                    return (
                      <RadioButtonWrapper
                        value={index.toString()} // Convert index to string to comply with RadioGroup expectations
                        currentAnswer={answers[currentQuestionIndex]}
                        onChange={(val) =>
                          handleChange(currentQuestionIndex, val)
                        }
                        isDisabled={submitted}
                        label={choice}
                      />
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
        </Box>
      </Box>
    </>
  );
}

// This will run at request time on the server.
export async function getServerSideProps(context: any) {
  const quizid = context.params.quizid;

  try {
    const quiz = await getQuiz(quizid, context.req, context.res);

    if (
      !Array.isArray(quiz.questions) ||
      !quiz ||
      !quiz.questions ||
      quiz.questions.length === 0
    ) {
      throw new Error('Quiz not found');
    }

    return {
      props: {
        quiz
      }
    };
  } catch (error) {
    console.log(error);
    return { notFound: true }; // This will result in a 404 error page
  }
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
