import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { ProductWithPrice } from 'types/types';
import type { Database } from 'types/types_db';
import { isQuestion } from 'types/type_guards';
import { Question } from 'types/types';

export const supabase = createBrowserSupabaseClient<Database>();

export const getActiveProductsWithPrices = async (): Promise<
  ProductWithPrice[]
> => {
  const { data, error } = await supabase
    .from('products')
    .select('*, prices(*)')
    .eq('active', true)
    .eq('prices.active', true)
    .order('metadata->index')
    .order('unit_amount', { foreignTable: 'prices' });

  if (error) {
    console.log(error.message);
    throw error;
  }
  console.log('dfdf', data);
  // TODO: improve the typing here.
  return (data as any) || [];
};

export const updateUserName = async (user: User, name: string) => {
  await supabase
    .from('users')
    .update({
      full_name: name
    })
    .eq('id', user.id);
};

export async function getSession() {
  try {
    const {
      data: { session }
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUserDetails() {
  try {
    const { data: userDetails } = await supabase
      .from('users')
      .select('*')
      .single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getSubscription() {
  try {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*, prices(*, products(*))')
      .in('status', ['trialing', 'active'])
      .maybeSingle();
    return subscription;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export const getHomePageQuizzes = async () => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
    id,
    title,
    image_url
    `
    )
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(12);

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const getMyQuizzes = async () => {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) {
    throw new Error('User not logged in');
  }

  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
    id,
    title,
    image_url
    `
    )
    .eq('creator_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const paginateQuizzes = async (page: number) => {
  const limit = 12;
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      id,
      title
      `
    )
    .order('created_at', { ascending: false })
    .limit(limit)
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const searchQuizzes = async (search: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      id,
      title,
      
      `
    )
    .textSearch('title', search)
    .limit(10);

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const paginateSearchQuizzes = async (search: string, page: number) => {
  const limit = 10;
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
      id,
      title
      `
    )
    .textSearch('title', search)
    .limit(limit)
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const getQuiz = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
        id,
        title,
        created_at,
        creator_id,
        model,
        questions (
          id,
          quiz_id,
          created_at,
          question_data
          )
      `
    )
    .eq('id', quizId)
    .single();

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const getMessages = async (topicId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(
      `
      message,
      type
    `
    )
    .eq('topic_id', topicId);

  if (error) {
    console.error('Error:', error);
    throw error;
  }
  return data ?? [];
};

export const clearChatMessages = async (quizId: string) => {
  await supabase.from('messages').delete().eq('quiz_id', quizId);
};

//use rpc
export const getQuestions = async (topicId: string) => {
  const { data, error } = await supabase.rpc('get_questions', {
    tid: topicId
  });

  if (error) {
    console.error('Error:', error);
    throw error;
  }
  return data ?? [];
};


export const getPublishedQuestions = async (topicId: string) => {
  const { data, error } = await supabase.rpc('get_published_questions', {
    tid: topicId
  });

  if (error) {
    console.error('Error:', error);
    throw error;
  }
  return data ?? [];
};


export const updateQuizTitle = async (quizId: string, title: string) => {
  await supabase
    .from('quizzes')
    .update({
      title
    })
    .eq('id', quizId);
};

export const getQuizAndTopics = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
        id,
        title,
        topics_order,
        selected_topic,
        topics (
          id,
          title
        )
      `
    )
    .eq('id', quizId)
    .single();

  if (error) {
    console.log(error.message);
    throw error;
  }


  return data ?? [];
};

export const getPublishedQuizAndTopics = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
        id,
        title,
        quizzes_snapshot!quizzes_snapshot_original_quiz_id_fkey(
        topics_order,
        topics_snapshot!fk_topic_to_quiz_snapshot (
          id,
          title
        )
      )
      `
    )
    .eq('id', quizId)
    .single();

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const deleteQuestion = async (questionId: string) => {
  await supabase.from('questions').delete().eq('id', questionId);
};

export const createQuizAndTopic = async () => {
  const { data, error } = await supabase.rpc('create_quiz_and_topic');
  if (error) {
    console.log(error.message);
    throw error;
  }
  return data ?? [];
};

export const createTopic = async (quizId: string) => {
  const { data, error } = await supabase.rpc('create_topic', {
    quiz_id: quizId
  });
  if (error) {
    console.log(error.message);
    throw error;
  }
  return data ?? [];
};

export const deleteTopic = async (topicId: string) => {
  const { data, error } = await supabase.rpc('delete_topic', {
    topic_id: topicId
  });
  if (error) {
    console.log(error.message);
    throw error;
  }
  return data ?? [];
};

export const editTopicTitle = async (topicId: string, title: string) => {
  const { data, error } = await supabase
    .from('topics')
    .update({ title })
    .eq('id', topicId);
  if (error) {
    console.log(error.message);
    throw error;
  }
  return data ?? [];
};

export const updateTopicOrder = async (
  quizId: string,
  topicsOrder: string[]
) => {
  const { data, error } = await supabase
    .from('quizzes')
    .update({ topics_order: topicsOrder })
    .eq('id', quizId);
  if (error) {
    console.log(error.message);
    throw error;
  }
  return data ?? [];
};

export const updateSelectedTopic = async (quizId: string, topicId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .update({ selected_topic: topicId })
    .eq('id', quizId);
  if (error) {
    console.log(error.message);
    throw error;
  }
  return data ?? [];
};

export const publishQuiz = async (quizId: string) => {
  const { data, error } = await supabase.rpc('publish_quiz', {
    qid: quizId
  });

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const getQuizInfo = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
    id,
    title,
    image_url
  `
    )
    .eq('id', quizId)
    .single();

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const uploadImageUrl = async (quizId: string, url: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .update({ image_url: url })
    .eq('id', quizId);

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};
