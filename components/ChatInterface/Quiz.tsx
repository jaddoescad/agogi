import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Box,
  RadioGroup,
  Radio,
  Button,
  Text,
  Collapse,
  Center,
  IconButton
} from '@chakra-ui/react';
import va from '@vercel/analytics';
import { Question, ShownAnswers } from 'types/types';
import {
  VscTriangleRight,
  VscTriangleDown,
  VscEdit,
  VscCheck,
  VscTrash
} from 'react-icons/vsc';
import Latex from 'react-latex';
import { updateQuizTitle } from '../../utils/supabase-client';
import { Spinner } from '@chakra-ui/react';
import { css_scroll } from 'styles/chakra-css-styles.js';
import React from 'react';
import { RenderContent } from 'components/RenderContent';
import { deleteQuestion, deleteAllQuestionsOfTopic } from '../../utils/supabase-client';
import DeleteConfirmationModal from 'components/deleteModal';



export default function QuizPage({
  title = 'Untitled',
  questions,
  setTitle,
  setQuestions,
  
}: {
  title: string;
  questions: Question[];
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
  setQuestions: React.Dispatch<React.SetStateAction<Question[] | null>>;
}) {
  const router = useRouter();
  const { quizId } = router.query as { quizId: string };
  const [shownAnswers, setShownAnswers] = useState<ShownAnswers>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null
  );



  useEffect(() => {
    if (quizId) {
      va.track('quiz-view');
    }
  }, [quizId]);

  const handleDeleteQuestion = async (questionId: string) => {
    setDeletingQuestionId(questionId);
    setIsLoading(true);
    try {
        await deleteQuestion(questionId);
        const updatedQuestions = questions.filter((q) => q.id !== questionId);
        setQuestions(updatedQuestions);
    } catch (error) {
        console.error('Failed to delete the question:', error);
    } finally {
        setDeletingQuestionId(null);
        setIsLoading(false);
    }
  };


  const toggleAnswerVisibility = (index: number) => {
    setShownAnswers((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (!questions || questions.length === 0) {
    return (
      <Box
        w="100%"
        display="flex"
        color="white"
        h={'100%'}
        justifyContent="center"
        alignItems="center"
      >
        <Text fontWeight={'bold'} fontSize="3xl">
          Please chat to generate quizzes
        </Text>
      </Box>
    );
  }

  return (
    <Box
      w="100%"
      h={'100%'}
      color="white"
      overflowY={'scroll'}
      css={css_scroll}
      paddingBottom={'100px'}
      // marginTop={'100px'}
    >
      <Box margin={'auto'} maxW={'600px'} w={'100%'}>

        <Box m={4} mt={20}>
          {questions &&
            questions.map((item, index) => (
              <Box display="flex" alignItems="center" key={index}>
                <DeleteConfirmationModal
                  questionId={item.id}
                  onDelete={handleDeleteQuestion}
                />
                <Box
                  key={index}
                  border="1px"
                  p={4}
                  mb={2}
                  w="100%"
                  borderRadius="lg"
                >
                  <Text fontSize="lg">
                    <RenderContent content={`${item.question}`} />
                  </Text>

                  <Text
                    fontSize="sm"
                    onClick={() => toggleAnswerVisibility(index)}
                    cursor="pointer"
                    display={'flex'}
                    alignItems={'center'}
                    fontWeight={'bold'}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {shownAnswers[index] ? (
                      <VscTriangleDown />
                    ) : (
                      <VscTriangleRight />
                    )}
                    {' Answers'}
                  </Text>

                  <Collapse in={shownAnswers[index]}>
                    {item.type === 'multiple-choice' ? (
                      <RadioGroup
                        mt={2}
                        value={item.correctAnswer.toString()}
                        isDisabled={true}
                        flexDirection="column"
                      >
                        {item.choices.map((choice, choiceIndex) => (
                          <Box m={1} key={choice}>
                            <Radio
                              value={choiceIndex.toString()}
                              fontWeight={
                                choiceIndex === item.correctAnswer
                                  ? 'bold'
                                  : 'normal'
                              }
                            >
                              <Latex>{choice}</Latex>
                            </Radio>
                          </Box>
                        ))}
                      </RadioGroup>
                    ) : (
                      <RadioGroup
                        mt={2}
                        value={item.correctAnswer ? 'true' : 'false'}
                        isDisabled={true}
                        flexDirection="column"
                      >
                        <Box m={1}>
                          <Radio
                            value="true"
                            fontWeight={
                              item.correctAnswer ? 'bold' : 'normal'
                            }
                          >
                            True
                          </Radio>
                        </Box>
                        <Box m={1}>
                          <Radio
                            value="false"
                            fontWeight={
                              !item.correctAnswer ? 'bold' : 'normal'
                            }
                          >
                            False
                          </Radio>
                        </Box>
                      </RadioGroup>
                    )}
                  </Collapse>
                </Box>
              </Box>
            ))}
        </Box>
      </Box>
    </Box>
  );
}
