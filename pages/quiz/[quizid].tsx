import { getQuiz } from '../../utils/supabase-client';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  RadioGroup,
  Radio,
  Button,
  Text
} from '@chakra-ui/react';
import va from '@vercel/analytics';
import Head from 'next/head';
import { getURL } from '@/utils/helpers';

type QuestionData = {
  question: string;
  correctAnswer: boolean;
  // ...other properties
};

type QuestionRow = {
  created_at: string | null;
  id: number;
  question_data: QuestionData;
  quiz_id: number | null;
};

type QuizRow = {
  created_at: string | null;
  creator_id: string;
  difficulty: string | null;
  id: number;
  title: string;
  questions: QuestionRow[];
  model: string | null;
};

export default function QuizPage(props: { quiz: QuizRow }) {
  // const [quiz, setQuiz] = useState<QuizRow | null>(null);

  const [answers, setAnswers] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const router = useRouter();
  const { quizid } = router.query;
  const quiz = props.quiz;

  const handleChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value === 'true';
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleReset = () => {
    if (!quiz) return;

    setAnswers(Array(quiz.questions.length).fill(null));
    setSubmitted(false);
    setResetKey((prevKey) => prevKey + 1); // increment key to force re-render
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
        <title>{quiz.title} - Quiz</title>
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
        <meta property="og:site_name" content={`${quiz.title} - Quiz`} />
        <meta
          property="og:description"
          content={`AI Generated Quiz about ${quiz.title}`}
        />
        <meta property="og:title" content={`${quiz.title} - Quiz`} />
        <meta name="twitter:card" content="" />
        <meta name="twitter:site" content="" />
        <meta name="twitter:title" content={`${quiz.title} - Quiz`} />
        <meta
          name="twitter:description"
          content={`AI Generated Quiz about ${quiz.title}`}
        />
      </Head>
      <Box
        w="100%"
        display="flex"
        //   justifyContent="center"
        alignItems="center"
        color="gray.700"
      >
        <Box margin={'auto'} maxW={'600px'} w={'100%'}>
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            color="gray.800"
            my={4}
          >
            {quiz.title}
          </Heading>
          <Text fontSize="lg" textAlign="center" color="gray.800" my={4}>
            Generated with:{' '}
            <span style={{ fontWeight: 'bold', color: '#3A3A3A' }}>
              {quiz.model}
            </span>
          </Text>

          {quiz.questions.map((item, index) => (
            <Box
              key={`${resetKey}-${index}`}
              border="1px"
              p={4}
              m={2}
              w="100%"
              borderRadius="lg"
            >
              <Text fontSize="lg">{item.question_data.question}</Text>
              {submitted && (
                <Text
                  color={
                    item.question_data.correctAnswer === answers[index]
                      ? 'green.500'
                      : 'red.500'
                  }
                >
                  {item.question_data.correctAnswer
                    ? 'Correct answer: True'
                    : 'Correct answer: False'}
                </Text>
              )}
              <RadioGroup
                mt={4}
                onChange={(value) => handleChange(index, value)}
                isDisabled={submitted}
              >
                <Radio mr={'2'} value="true">
                  True
                </Radio>
                <Radio value="false">False</Radio>
              </RadioGroup>
            </Box>
          ))}
          <Box w={'100%'}>
            {!submitted ? (
              <Button
                mt={4}
                mx={'auto'}
                display={'block'}
                bg="blue.500"
                color="white"
                rounded={'true'}
                onClick={handleSubmit}
              >
                See How You Did
              </Button>
            ) : (
              <Button
                mt={4}
                mx={'auto'}
                display={'block'}
                bg="blue.500"
                color="white"
                rounded={'true'}
                onClick={handleReset}
              >
                Try Again
              </Button>
            )}
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
    const quiz = await getQuiz(quizid);

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
        quiz: {
          ...quiz,
          questions: quiz.questions.map((question) => ({
            ...question,
            question_data: question.question_data as QuestionData
          }))
        }
      }
    };
  } catch (error) {
    console.log(error);
    return { notFound: true }; // This will result in a 404 error page
  }
}
