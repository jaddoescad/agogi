import { getPublishedQuestions } from '@/utils/supabase-client';
import Preview from 'components/Preview';
import { useGetPublishedQuizAndTopics } from 'hooks/useGetPublishedQuizAndTopics';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Question } from 'types/types';
import va from '@vercel/analytics';

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
  } = useGetPublishedQuizAndTopics(quizId) as {
    data: any;
    isLoading: boolean;
    isError: boolean;
  };

  useEffect(() => {
    if (!data) return;
    if (data.title) {
      setTitle(data.title);
    }
    const quizzes_snapshot = data?.quizzes_snapshot?.[0];
    const topics_order = quizzes_snapshot?.topics_order;
    const topics = quizzes_snapshot?.topics_snapshot;

    if (quizzes_snapshot) {
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
    getPublishedQuestions(selectedTopic).then((questions) => {
      setQuestions(questions);
    });
  }, [selectedTopic]);

    //track quiz views
    useEffect(() => {
        if (quizId) {
          va.track('quiz-view');
        }
      }, [quizId]);

  

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
