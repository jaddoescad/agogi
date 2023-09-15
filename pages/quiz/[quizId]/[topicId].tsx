import { getPublishedQuestions } from '@/utils/supabase-client';
import Preview from 'components/Preview';
import { useGetPublishedQuizAndTopics } from 'hooks/useGetPublishedQuizAndTopics';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Question } from 'types/types';
import { trackVercel } from '@/utils/analytics';
import { Center, Flex, Spinner } from '@chakra-ui/react';
import Head from 'next/head';
import { getPublishedQuizAndTopicsServer } from 'utils/supabase-server';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default function Quiz({
  quizId,
  topicId,
  initialData: data,
  topicTitle
}: {
  quizId: string;
  topicId: string;
  initialData: any;
  topicTitle: string;
}) {
  const [title, setTitle] = useState<string | null>('Untitled');
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [topicsOrder, setTopicsOrder] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isQuestionLoading, setIsQuestionLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);


  const refreshQuestions = async () => {
    if (!topicId) return;
    try {
      setIsQuestionLoading(true);
      const refreshedQuestions = await getPublishedQuestions(topicId);
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
    if (data.image_url) {
      setImage(data.image_url);
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
    setSelectedTopic(topicId);

    // setTopicTitle(topics.find((topic) => topic.id === topicId)?.title);
  }, [topicId, topics]);

  //track quiz views
  useEffect(() => {
    if (quizId) {
      trackVercel('quiz-view');
    }
  }, [quizId]);

  const resetQuiz = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setSubmitted(false);
    setFeedback(null);
  };

  return (
    <Flex
      bg={'#0C0D0F'}
      w={'100vw'}
      h="100vh"
      flexDir={'column'}
      justifyContent={'center'}
    >
      <>
        <Head>
          <title>{title}</title>
          <meta name="robots" content="follow, index" />
          <link href="/favicon.ico" rel="shortcut icon" />
          <meta content={topicTitle} name="description" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={`Quiz on ${data.title}`} />
          <meta
            property="og:description"
            content={topicTitle}
          />
          <meta property="og:title" content={`Quiz on ${data.title}`} />
          <meta name="twitter:site" content="@vercel" />
          <meta name="twitter:title" content={`Quiz on ${data.title}`} />
          <meta
            name="twitter:description"
            content={topicTitle}
          />
          <meta property="og:image" content={data.image_url} />
          <meta name="twitter:image" content={data.image_url} />
        </Head>
        <Preview
          quizId={quizId}
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
      </>
    </Flex>
  );
}

export async function getServerSideProps(context: any) {
  const quizId = context.query.quizId;
  const topicId = context.query.topicId;

  let initialData;
  let topicTitle;

  // Fetch the data required for the quiz
  try {
    const supabaseServerClient = createServerSupabaseClient({
      res: context.res,
      req: context.req
    });

    const data = await getPublishedQuizAndTopicsServer(
      quizId,
      supabaseServerClient
    );
    initialData = data;

    const topics = initialData?.quizzes_snapshot?.[0]?.topics_snapshot;
    if (topics) {
      const matchedTopic = topics.find((topic) => topic.id === topicId);
      topicTitle = matchedTopic?.title;
    }

    // ... [Fetch other required data and populate initialData]
  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle error appropriately
  }

  return {
    props: {
      initialData,
      quizId,
      topicId,
      topicTitle // pass the derived topicTitle to your component
    }
  };
}
