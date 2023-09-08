import Preview from 'components/Preview';
import { useGetQuizAndTopics } from 'hooks/useGetQuizAndTopics';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useGetPublishedQuizAndTopics } from 'hooks/useGetPublishedQuizAndTopics';
import { Question } from 'types/types';
import va from '@vercel/analytics';
import { getQuestions } from '@/utils/supabase-client';
import { Box } from '@chakra-ui/react';

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
          (a:any, b:any) => topics_order.indexOf(a.id) - topics_order.indexOf(b.id)
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
      setQuestions(questions as Question[]);
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
    <Box>
      <Preview
        topics={topics}
        title={title || 'Untitled'}
        selectedTopic={selectedTopic || topics[0]?.id}
        setSelectedTopic={setSelectedTopic}
        questions={questions}
        topicTitle={topicTitle || 'Untitled'}
        topicsOrder={data?.topics_order}
      />
    </Box>
  );
}
