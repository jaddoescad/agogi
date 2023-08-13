import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
  Box,
  RadioGroup,
  Radio,
  Button,
  Text,
  Collapse
} from '@chakra-ui/react';
import va from '@vercel/analytics';
import { Question } from 'types/types';
import { VscTriangleRight, VscTriangleDown } from 'react-icons/vsc';

export default function QuizPage(props: { questions: Question[] | null }) {
  const router = useRouter();
  const { quizid } = router.query;
  const questions = props.questions;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = questions?.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    if (quizid) {
      va.track('quiz-view');
    }
  }, [quizid]);

  // Calculate the total number of pages
  const totalPages = questions ? Math.ceil(questions.length / itemsPerPage) : 0;

  const [shownAnswers, setShownAnswers] = useState({});

  const toggleAnswerVisibility = (index: number) => {
    setShownAnswers((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };


  return (
    <>
      <Box
        w="100%"
        display="flex"
        color="white"
        h={'100%'}
        overflowY={'scroll'}
      >
        <Box margin={'auto'} maxW={'600px'} w={'100%'}>
          <Box m={4}>
            {currentQuestions &&
              currentQuestions.map((item, index) => (
                <Box
                  key={index}
                  border="1px"
                  p={4}
                  mb={2}
                  w="100%"
                  borderRadius="lg"
                >
                  <Text fontSize="lg">{item.question}</Text>

                  {/* Answer Visibility Toggle Button for each question */}
                  <Text
                    fontSize="sm"
                    onClick={() => toggleAnswerVisibility(index)}
                    cursor="pointer"
                    display={'flex'}
                    alignItems={'center'} // This is the change
                    fontWeight={'bold'}
                    _hover={{ textDecoration: 'underline' }} // Optional: underline on hover for clarity
                  >
                    {shownAnswers[index] ? (
                      <VscTriangleDown />
                    ) : (
                      <VscTriangleRight />
                    )}
                    {' Answers'}
                  </Text>

                  <Collapse in={shownAnswers[index]}>
                    <RadioGroup
                      mt={2}
                      value={item.correctAnswer ? 'true' : 'false'}
                      isDisabled={true}
                      flexDirection="column"
                    >
                      <Box m={1}>
                        <Radio
                          mr={'2'}
                          value="true"
                          fontWeight={item.correctAnswer ? 'bold' : 'normal'}
                        >
                          True
                        </Radio>
                      </Box>
                      <Box m={1}>
                        <Radio
                          value="false"
                          fontWeight={!item.correctAnswer ? 'bold' : 'normal'}
                        >
                          False
                        </Radio>
                      </Box>
                    </RadioGroup>
                  </Collapse>
                </Box>
              ))}
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
    <Button
        onClick={() => setCurrentPage(currentPage - 1)}
        isDisabled={currentPage === 1}
        bg="gray.700"  // Set to a dark gray color
        color="white"  // Set text color to white
    >
        Previous
    </Button>

    <Text mx={1}>
        {currentPage}/{totalPages}
    </Text>

    <Button
        onClick={() => setCurrentPage(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        bg="gray.700"  // Set to a dark gray color
        color="white"  // Set text color to white
        ml="-4"  // Add a negative margin to the left side to pull the buttons closer
    >
        Next
    </Button>
</Box>

        </Box>
      </Box>
    </>
  );
}