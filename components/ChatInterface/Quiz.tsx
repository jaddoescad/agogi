import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, RadioGroup, Radio, Button, Text } from '@chakra-ui/react';
import va from '@vercel/analytics';
import { QuizRow } from 'types';
import {getQuizQuestions} from '../../utils/supabase-client'

export default function QuizPage(props: { quiz: any | null }) {
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
    va.track('see how you did');
    setSubmitted(true);
  };

  const handleReset = () => {
    if (!quiz) return;

    setAnswers(Array(quiz.length).fill(null));
    setSubmitted(false);
    setResetKey((prevKey) => prevKey + 1); // increment key to force re-render
  };

  //track quiz views
  useEffect(() => {
    if (quizid) {
      va.track('quiz-view');
    }
  }, [quizid]);



    

  return (
    <>
      <Box
        w="100%"
        display="flex"
        //   justifyContent="center"
        color="white"
        h={'100%'}
        overflowY={'scroll'}
      >
        <Box margin={'auto'} maxW={'600px'} w={'100%'}>
          <Box m={4}>
            <Text fontSize="lg" textAlign="center" color="gray.800" my={4}>
              Generated with:{' '}
            </Text>

            {quiz &&
              quiz.map((item, index) => (
                <Box
                  key={`${resetKey}-${index}`}
                  border="1px"
                  p={4}
                  mb={2}
                  w="100%"
                  borderRadius="lg"
                >
                  <Text fontSize="lg">{item.question}</Text>
                  {submitted && (
                    <Text
                      color={
                        item.correctAnswer === answers[index]
                          ? 'green.500'
                          : 'red.500'
                      }
                    >
                      {item.correctAnswer
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
      </Box>
    </>
  );
}
