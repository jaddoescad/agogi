import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { ProductWithPrice } from 'types';
import type { Database } from 'types_db';

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

export const getQuizAndQuestions = async (quizId: string) => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
    id,
    title,
    difficulty
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

export const getHomePageQuizzes = async () => {
  const { data, error } = await supabase
    .from('quizzes')
    .select(
      `
    id,
    title,
    difficulty
    `
    )
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
    difficulty
    `
    )
    .eq('creator_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)
    ;

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
      title,
      difficulty
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
      difficulty
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
      title,
      difficulty
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
        difficulty,
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
