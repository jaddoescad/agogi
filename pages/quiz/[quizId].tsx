import { getPublishedQuestions } from '@/utils/supabase-client';
import Preview from 'components/Preview';
import { useGetPublishedQuizAndTopics } from 'hooks/useGetPublishedQuizAndTopics';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Question } from 'types/types';
import va from '@vercel/analytics';
import { Box, Button } from '@chakra-ui/react';

export default function Quiz() {
  const quizId = useRouter().query.quizId as string;
  const [title, setTitle] = useState<string | null>('Untitled');
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topicTitle, setTopicTitle] = useState<string | null>('');
  const [topicsOrder, setTopicsOrder] = useState<string[]>([]);

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
      setIsLoading(true);
      const refreshedQuestions = await getPublishedQuestions(selectedTopic);
      setQuestions(refreshedQuestions as Question[]);
    } catch (error) {
      console.error('Failed to refresh questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!data) return;
    setIsLoading(true);
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
          (a:any, b:any) => topics_order.indexOf(a.id) - topics_order.indexOf(b.id)
        );
        setTopics(topics_);
        setSelectedTopic(topics_order[0]);
      } else {
        console.error('Failed to load quiz');
        setIsLoading(false);
      }
    } else {
      console.error('Failed to load quiz');
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    refreshQuestions();
    setTopicTitle(topics.find((topic) => topic.id === selectedTopic)?.title);
  }, [selectedTopic]);

  //track quiz views
  useEffect(() => {
    if (quizId) {
      va.track('quiz-view');
    }
  }, [quizId]);

  return (
    <Box>
      <Preview
        topics={topics}
        title={title || 'Untitled'}
        selectedTopic={selectedTopic || topics[0]?.id}
        setSelectedTopic={setSelectedTopic}
        questions={questions}
        topicTitle={topicTitle || 'Untitled'}
        topicsOrder={topicsOrder}
      />
    </Box>
  );
}
