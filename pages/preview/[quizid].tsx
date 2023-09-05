// import {
//   checkQuizAndTopicExist,
//   getQuiz,
//   withPageAuth
// } from '../../utils/supabase-server';
// import { useRouter } from 'next/router';
// import { useState, useEffect } from 'react';
// import {
//   Box,
//   Heading,
//   RadioGroup,
//   Radio,
//   Button,
//   Text,
//   Progress,
//   Flex,
//   Center
// } from '@chakra-ui/react';
// import va from '@vercel/analytics';
// import Head from 'next/head';
// import { getURL } from '@/utils/helpers';
// import Navbar from 'components/ui/Navbar/Navbar';
// import { RenderContent } from 'components/RenderContent';
// import Latex from 'react-latex';
// import { useGetQuizAndTopics } from 'hooks/useGetQuizAndTopics';
// import { getQuestions } from 'utils/supabase-client';
// import { Question } from 'types/types';
// import { Spinner } from '@chakra-ui/react';

// export default function PreviewQuiz() {
//   const [answers, setAnswers] = useState<(boolean | string)[]>([]);
//   const [submitted, setSubmitted] = useState(false);
//   const router = useRouter();
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [feedback, setFeedback] = useState<string | null>(null);
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
//   const [title, setTitle] = useState<string | null>('Untitled');
//   const [topics, setTopics] = useState<any[]>([]);
//   const [loadingTopics, setLoadingTopics] = useState(false);

//   const quizId = useRouter().query.quizId as string;
//   const {
//     data,
//     isLoading: isQuizLoading,
//     isError
//   } = useGetQuizAndTopics(quizId) as {
//     data: any;
//     isLoading: boolean;
//     isError: boolean;
//   };

//   const handleChange = (index: number, value: string | boolean) => {
//     const newAnswers = [...answers];
//     newAnswers[index] = value;
//     setAnswers(newAnswers);

//     // Provide immediate feedback
//     if (questions[index].correctAnswer.toString() === value) {
//       setFeedback('Correct');
//     } else {
//       setFeedback('Incorrect');
//     }
//   };

//   useEffect(() => {
//     if (!selectedTopic) return;

//     setLoadingTopics(true); // Set loading to true before fetching

//     getQuestions(selectedTopic).then((questions) => {
//       setQuestions(questions);
//       setLoadingTopics(false); // Set loading to false after fetching
//     });
//   }, [selectedTopic]);

//   useEffect(() => {
//     console.log('data', data);

//     if (!data) return;
//     if (data.selected_topic) {
//       setSelectedTopic(data.selected_topic);
//     }

//     if (data.title) {
//       setTitle(data.title);
//     }

//     if (data.topics_order && data.topics) {
//       const topics = data.topics.sort(
//         (a, b) =>
//           data.topics_order.indexOf(a.id) - data.topics_order.indexOf(b.id)
//       );
//       setTopics(topics);
//     }
//   }, [data]);

//   const handlePreviousQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(currentQuestionIndex - 1);
//     }
//     // Reset feedback when navigating
//     setFeedback(null);
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//     setFeedback(null);
//   };

//   const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

//   const handleReset = () => {
//     setAnswers(Array(questions.length).fill(null));
//     setSubmitted(false);
//     setFeedback(null); // reset feedback
//   };

//   //track quiz views
//   useEffect(() => {
//     if (quizId) {
//       va.track('quiz-view');
//     }
//   }, [quizId]);

//   if (!data) {
//     return 'Loading...';
//   }

//   return !data ? (
//     <Text>Loading...</Text>
//   ) : (
//     <Flex minWidth={'1000px'}>
//       <SideBar
//         topics={topics}
//         onTopicClick={setSelectedTopic}
//         selectedTopic={selectedTopic}
//       />
//       <Box w="100%" bg="gray.900" color="white">
//         <Navbar quizTitle={title} quizPreviewTitle />

//         <Box h="calc(100vh - 60px)" margin={'auto'} maxW={'600px'} w={'100%'}>
//           {!loadingTopics ? (
//             <Box pt={14}>
//               <Progress value={progress} size="md" colorScheme="blue" mb={4} />

//               <Box
//                 border="1px"
//                 p={4}
//                 mb={2}
//                 w="100%"
//                 borderRadius="lg"
//                 bg="gray.800"
//                 boxShadow="md"
//               >
//                 <Text fontSize="lg" color="white">
//                   {questions &&
//                   questions.length > 0 &&
//                   currentQuestionIndex < questions.length ? (
//                     <RenderContent
//                       content={`${questions[currentQuestionIndex].question}`}
//                     />
//                   ) : (
//                     <Text>No questions detected</Text>
//                   )}
//                 </Text>
//                 <Text
//                   mt={2}
//                   fontSize="md"
//                   color={feedback === 'Correct' ? 'green.500' : 'red.500'}
//                 >
//                   {feedback}
//                 </Text>
//                 {submitted && (
//                   <Text
//                     mt={2}
//                     fontSize="md"
//                     color={
//                       questions[
//                         currentQuestionIndex
//                       ].correctAnswer.toString() ===
//                       answers[currentQuestionIndex]
//                         ? 'green.500'
//                         : 'red.500'
//                     }
//                   >
//                     Correct answer:{' '}
//                     {
//                       questions[currentQuestionIndex].choices[
//                         questions[currentQuestionIndex].correctAnswer
//                       ]
//                     }
//                   </Text>
//                 )}

//                 <RadioGroup
//                   mt={4}
//                   onChange={(value) =>
//                     handleChange(currentQuestionIndex, value)
//                   }
//                   value={answers[currentQuestionIndex]}
//                   display={'flex'}
//                   flexDir={'column'}
//                 >
//                   {questions[currentQuestionIndex]?.choices?.map(
//                     (choice, index) => {
//                       return (
//                         <RadioButtonWrapper
//                           value={index.toString()} // Convert index to string to comply with RadioGroup expectations
//                           currentAnswer={answers[currentQuestionIndex]}
//                           onChange={(val) =>
//                             handleChange(currentQuestionIndex, val)
//                           }
//                           isDisabled={submitted}
//                           label={choice}
//                         />
//                       );
//                     }
//                   )}
//                 </RadioGroup>
//               </Box>
//               <Flex justifyContent="space-between">
//                 <Button
//                   mt={4}
//                   mx={2} // added margin for separation
//                   display={'block'}
//                   bg="blue.500"
//                   color="white"
//                   rounded={'true'}
//                   onClick={handlePreviousQuestion}
//                   isDisabled={currentQuestionIndex === 0 || submitted} // disable if it's the first question or quiz is submitted
//                 >
//                   Back
//                 </Button>
//                 <Button
//                   mt={4}
//                   mx={2}
//                   display={'block'}
//                   bg="blue.500"
//                   color="white"
//                   rounded={'true'}
//                   onClick={!submitted ? handleNextQuestion : handleReset}
//                 >
//                   {!submitted ? 'Next' : 'Try Again'}
//                 </Button>
//               </Flex>
//             </Box>
//           ) : (
//             <Center>
//               <Spinner />
//             </Center>
//           )}
//         </Box>
//       </Box>
//     </Flex>
//   );
// }

// function RadioButtonWrapper({
//   value,
//   currentAnswer,
//   onChange,
//   isDisabled,
//   label
// }) {
//   return (
//     <Box
//       border="1px solid"
//       p={4}
//       mb={2}
//       w="100%"
//       borderRadius="lg"
//       bg={currentAnswer === value ? 'gray.700' : 'gray.800'}
//       boxShadow="md"
//       onClick={() => !isDisabled && onChange(value)}
//       role="group"
//       display={'flex'}
//       _hover={{ bg: 'gray.750' }}
//       cursor={'pointer'}
//       my="2"
//     >
//       <Radio
//         value={value}
//         size="lg"
//         colorScheme="blue"
//         isChecked={currentAnswer === value}
//       />
//       <Text
//         fontSize="lg"
//         color="white"
//         ml="2"
//         _groupHover={{ textDecoration: 'underline' }}
//       >
//         {label}
//       </Text>
//     </Box>
//   );
// }

// import { IconButton, Link } from '@chakra-ui/react';
// import { IoIosArrowBack } from 'react-icons/io';
// import Logo from '@/components/icons/Logo';

// export const SideBar = ({ topics, onTopicClick, selectedTopic }) => {
//   const router = useRouter();

//   const handleTopicClick = (id: string) => {
//     onTopicClick(id);
//   };

//   return (
//     <Box h={'100vh'} w={'350px'} overflow={'auto'} bg={'#0C0D0F'}>
//       <Link href="/quizzes" aria-label="Back to Quizzes" color="white">
//         <Link href="/" className="s.logo" aria-label="Logo">
//           <Flex
//             align="center"
//             p="5"
//             _hover={{
//               textDecoration: 'none'
//             }}
//             cursor={'pointer'}
//           >
//             <Logo />
//             <Text fontSize="md" fontWeight="medium" ml="2" mr="1">
//               {`AGOGI`}
//             </Text>
//             {/* <Text fontSize="md">{`- AI Generated Quizzes`}</Text> */}
//           </Flex>
//         </Link>
//       </Link>
//       {topics.map((topic, index) => (
//         <Button
//           key={topic.id}
//           pl={6}
//           py={8}
//           color="white"
//           bg={selectedTopic === topic.id ? 'teal' : 'transparent'}
//           onClick={() => handleTopicClick(topic.id)}
//           _hover={{ bg: selectedTopic === topic.id ? 'teal' : 'gray.700' }}
//           // _active={{ bg: 'gray.700' }}
//           w="100%"
//           justifyContent="flex-start"
//         >
//           {topic.title}
//         </Button>
//       ))}
//     </Box>
//   );
// };

import Preview from 'components/Preview';
import { useGetQuizAndTopics } from 'hooks/useGetQuizAndTopics';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useGetPublishedQuizAndTopics } from 'hooks/useGetPublishedQuizAndTopics';
import { Question } from 'types/types';
import va from '@vercel/analytics';
import { getQuestions } from '@/utils/supabase-client';

export default function Quiz() {
  const quizId = useRouter().query.quizId as string;
  const [title, setTitle] = useState<string | null>('Untitled');
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const {
    data,
    isLoading: isQuizLoading,
    isError
  } = useGetQuizAndTopics(quizId) as {
    data: any;
    isLoading: boolean;
    isError: boolean;
  };

  useEffect(() => {
    if (!data) return;
    if (data.title) {
      setTitle(data.title);
    }


    const topics_order = data?.topics_order;
    const topics = data?.topics;
    console.log('data', data)
    console.log('topics', topics)
    console.log('topics_order', topics_order)

    if (data) {
      if (topics_order && topics) {
        const topics_ = topics.sort(
          (a, b) => topics_order.indexOf(a.id) - topics_order.indexOf(b.id)
        );
        setTopics(topics_);
        setSelectedTopic(topics_order[0]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (!selectedTopic) return;
    getQuestions(selectedTopic).then((questions) => {
      setQuestions(questions);
    });
  }, [selectedTopic]);

  //track quiz views
  useEffect(() => {
    if (quizId) {
      va.track('quiz-view');
    }
  }, [quizId]);

  // return <Preview quizId={quizId} />
  return (
    <Preview
      quizId={quizId}
      topics={topics}
      title={title}
      selectedTopic={selectedTopic}
      setSelectedTopic={setSelectedTopic}
      questions={questions}
    />
  );
}
