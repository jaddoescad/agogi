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
  const [topicTitle, setTopicTitle] = useState<string | null>('');

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

    setTopicTitle(topics.find((topic) => topic.id === selectedTopic).title);

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
      topics={topics}
      title={title}
      selectedTopic={selectedTopic}
      setSelectedTopic={setSelectedTopic}
      questions={questions}
      topicTitle={topicTitle}
    />
  );
}
