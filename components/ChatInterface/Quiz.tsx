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
import { Question } from 'types/types';
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
import { deleteQuestion } from '../../utils/supabase-client';
import DeleteConfirmationModal from 'components/deleteModal';

export default function QuizPage({
  title = 'Untitled',
  questions,
  setTitle,
  currentPage,
  setCurrentPage,
  setQuestions
}: {
  title: string;
  questions: Question[];
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setQuestions: React.Dispatch<React.SetStateAction<Question[] | null>>;
}) {
  const router = useRouter();
  const { quizId } = router.query as { quizid: string };
  // const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = questions?.slice(indexOfFirstItem, indexOfLastItem);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    }
  };

  const handleSaveTitle = async () => {
    setIsLoading(true);
    try {
      await updateQuizTitle(quizId, title); // Assuming the updateQuizTitle requires the quizid and new title
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update title:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleConfirm = async () => {
    if (title !== 'Untitled' && quizId) {
      await updateQuizTitle(quizId, title);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (quizId) {
      va.track('quiz-view');
    }
  }, [quizId]);

  const handleDeleteQuestion = async (questionId: string) => {
    setDeletingQuestionId(questionId);
    setIsLoading(true); // Start loading
    try {
        await deleteQuestion(questionId);
        const updatedQuestions = questions.filter((q) => q.id !== questionId);
        setQuestions(updatedQuestions);
    } catch (error) {
        console.error('Failed to delete the question:', error);
    } finally {
        setDeletingQuestionId(null);
        setIsLoading(false); // End loading
    }
};

  

  // Calculate the total number of pages

  const [shownAnswers, setShownAnswers] = useState({});

  useEffect(() => {
    if (questions) {
      setTotalPages(Math.ceil(questions.length / itemsPerPage));
    }
  }, [questions]);

  const toggleAnswerVisibility = (index: number) => {
    setShownAnswers((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  useEffect(() => {
    // Reset shownAnswers whenever the currentPage changes
    setShownAnswers({});
  }, [currentPage]);

  if (totalPages === 0) {
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
    <>
      <Box
        w="100%"
        h={'100%'}
        color="white"
        overflowY={'scroll'}
        css={css_scroll}
        paddingBottom={'100px'}
      >
        <Box margin={'auto'} maxW={'600px'} w={'100%'}>
          <Center display="flex" w="100%" alignItems="center" mt={4} mb={6}>
            {isEditing ? (
              <>
                <input
                  value={title}
                  onChange={handleTitleChange}
                  onBlur={handleTitleConfirm}
                  onKeyPress={handleKeyPress}
                  style={{
                    fontSize: '2rem', // Make the font size similar to the title
                    fontWeight: 'bold',
                    opacity: '0.7',
                    border: 'none',
                    borderBottom: '2px solid white', // Stylish bottom border
                    backgroundColor: 'transparent', // Transparent background
                    color: 'white', // Font color
                    outline: 'none', // Remove the blue outline
                    textAlign: 'center' // Center the text within the input
                  }}
                />
                <IconButton
                  aria-label="Confirm Edit"
                  icon={
                    isLoading ? <Spinner size="xs" /> : <VscCheck size="xs" />
                  }
                  ml={2}
                  size="sm"
                  variant="ghost"
                  _hover={{ bg: 'gray.700' }}
                  onClick={handleSaveTitle}
                  isDisabled={isLoading}
                />
              </>
            ) : (
              <>
                <Text fontSize="4xl" fontWeight="bold" opacity="0.7">
                  {title}
                </Text>
                <IconButton
                  aria-label="Edit Quiz"
                  icon={<VscEdit size={'1.2rem'} />}
                  ml={2}
                  size="sm"
                  variant="ghost"
                  _hover={{ bg: 'gray.700' }}
                  onClick={() => setIsEditing(true)}
                />
              </>
            )}
          </Center>

          <Box m={4}>
            {currentQuestions &&
              currentQuestions.map((item, index) => (
                <Box display="flex" alignItems="center" key={index}>
                  {/* Delete Button */}
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
                                value={choiceIndex.toString()} // Using index as the value
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

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              onClick={() => setCurrentPage(currentPage - 1)}
              isDisabled={currentPage === 1}
              bg="gray.700" // Set to a dark gray color
              color="white" // Set text color to white
            >
              Previous
            </Button>

            <Text mx={1} fontWeight={'bold'}>
              {currentPage}/{totalPages}
            </Text>

            <Button
              onClick={() => setCurrentPage(currentPage + 1)}
              isDisabled={currentPage === totalPages}
              bg="gray.700" // Set to a dark gray color
              color="white" // Set text color to white
              ml="-4" // Add a negative margin to the left side to pull the buttons closer
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
