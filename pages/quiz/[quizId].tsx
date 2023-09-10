import { getPublishedQuestions } from '@/utils/supabase-client';
import Preview from 'components/Preview';
import { useGetPublishedQuizAndTopics } from 'hooks/useGetPublishedQuizAndTopics';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Question } from 'types/types';
import va from '@vercel/analytics';
import { Box, Button, Center, Flex, Spinner } from '@chakra-ui/react';

export default function Quiz() {
  const quizId = useRouter().query.quizId as string;
  const [title, setTitle] = useState<string | null>('Untitled');
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topicTitle, setTopicTitle] = useState<string | null>('');
  const [topicsOrder, setTopicsOrder] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isQuestionLoading, setIsQuestionLoading] = useState<boolean>(false);

  const {
    data,
    isLoading: isQuizLoading,
    isError
  } = useGetPublishedQuizAndTopics(quizId) as {
    data: any;
    isLoading: boolean;
    isError: boolean;
  };

  const refreshQuestions = async () => {
    if (!selectedTopic) return;

    try {
      setIsQuestionLoading(true);
      const refreshedQuestions = await getPublishedQuestions(selectedTopic);
      setCurrentQuestionIndex(0);
      setQuestions(refreshedQuestions as Question[]);
    } catch (error) {
      console.error('Failed to refresh questions:', error);
    } finally {
      setIsQuestionLoading(false);
    }
  };

  useEffect(() => {
    if (!data) return;
    resetQuiz();
    if (data.title) {
      setTitle(data.title);
    }
    const quizzes_snapshot = data?.quizzes_snapshot?.[0];
    const topics_order = quizzes_snapshot?.topics_order;
    const topics = quizzes_snapshot?.topics_snapshot;

    if (quizzes_snapshot) {
      if (topics_order && topics) {
        setTopicsOrder(topics_order);
        const topics_ = topics.sort(
          (a: any, b: any) =>
            topics_order.indexOf(a.id) - topics_order.indexOf(b.id)
        );
        setTopics(topics_);
        setSelectedTopic(topics_order[0]);
      } else {
        console.error('Failed to load quiz');
      }
    } else {
      console.error('Failed to load quiz');
    }
  }, [data]);

  useEffect(() => {
    resetQuiz();
    refreshQuestions();
    setTopicTitle(topics.find((topic) => topic.id === selectedTopic)?.title);
  }, [selectedTopic]);

  //track quiz views
  useEffect(() => {
    if (quizId) {
      va.track('quiz-view');
    }
  }, [quizId]);

  const resetQuiz = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSubmitted(false);
    setFeedback(null);
  }

  return (
    <Flex bg={'#0C0D0F'} w={"100vw"} h="100vh" flexDir={"column"} justifyContent={"center"}>
      {!isQuizLoading ? (
        <Preview
          topics={topics}
          title={title || 'Untitled'}
          selectedTopic={selectedTopic || topics[0]?.id}
          setSelectedTopic={setSelectedTopic}
          questions={questions}
          topicTitle={topicTitle || 'Untitled'}
          topicsOrder={topicsOrder}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          answers={answers}
          setAnswers={setAnswers}
          submitted={submitted}
          setSubmitted={setSubmitted}
          feedback={feedback}
          setFeedback={setFeedback}
          isQuestionLoading={isQuestionLoading}
        />
      ) : (
        <Center mt={5}>
          <Spinner color='white' />
        </Center>
      )}
    </Flex>
  );
}
