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
};

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizRow | null>(null);

  const [answers, setAnswers] = useState<boolean[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const router = useRouter();
  const { quizid } = router.query;

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

  const getQuiz_ = async (quizid: string) => {
    try {
      const quiz = await getQuiz(quizid);

      if (Array.isArray(quiz.questions)) {
        if (!quiz || !quiz.questions || quiz.questions.length === 0) {
          throw new Error('Quiz not found');
        }
        setQuiz({
          ...quiz,
          questions: quiz.questions.map((question) => ({
            ...question,
            question_data: question.question_data as QuestionData
          }))
        });
        setAnswers(Array(quiz.questions.length).fill(null));
      } else {
        throw new Error('Quiz questions are not in the expected format');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (quizid) {
      getQuiz_(quizid as string);
    }
  }, [quizid]);

  if (!quiz) {
    return 'Loading...';
  }

  return !quiz ? (
    <Text>Loading...</Text>
  ) : (
    <Box
      w="100%"
      display="flex"
      //   justifyContent="center"
      alignItems="center"
      color="gray.700"
    >
      <Box margin={'auto'} maxW={
        '600px'
      }
      w={'100%'}
      >
        <Heading as="h1" size="2xl" textAlign="center" color="gray.800" my={4}>
          {quiz.title}
        </Heading>

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
              <Radio  mr={"2"} value="true">True</Radio>
              <Radio value="false">False</Radio>
            </RadioGroup>
          </Box>
        ))}
        <Box w={'100%'} >
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
  );
}
