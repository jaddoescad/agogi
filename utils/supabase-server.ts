import { SupabaseClient } from '@supabase/supabase-js';
import { Question } from '../types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export const addQuizAndQuestions = async (
  quiz: any,
  supabase: SupabaseClient<any, 'public', any>
) => {
  const { data: id, error } = await supabase.rpc('insert_quiz', {
    quiz_json: quiz
  });

  console.log('error');

  if (error || !id || typeof id !== 'number') {
    console.error('Error:', error);
    throw error;
  }
  return id ?? [];
};

export const saveMessage = async (
  supabase: SupabaseClient<any, 'public', any>,
  message: string,
  quizId: string,
  type: string
) => {
  const { data, error } = await supabase.from('messages').insert([
    {
      quiz_id: quizId,
      message: message,
      type: type
    }
  ]);

  if (error) {
    console.error('Error:', error);
    throw error;
  }
  return data ?? [];
};

export const insertQuizOrDonothing = async (
  supabase: SupabaseClient<any, 'public', any>,
  quizId: string
) => {
  const { data, error } = await supabase
    .from('quizzes')
    .upsert([{ id: quizId }], { onConflict: 'id' });

  if (error) {
    console.error('Error:', error);
    throw error;
  }

  return data ?? [];
};

export const insertQuestions = async (
  supabase: SupabaseClient<any, 'public', any>,
  questions: [Question],
  quidId: string,
  quizType: string
) => {
  const { data, error } = await supabase.from('questions').insert(
    questions.map((question) => {
      return {
        quiz_id: quidId,
        question_data: question,
        type: quizType
      };
    })
  );

  if (error) {
    console.error('Error:', error);
    throw error;
  }

  return data ?? [];
};

export const fetchQuestions = async (
  supabase: SupabaseClient<any, 'public', any>,
  quizId: string
) => {
  const { data, error } = await supabase
    .from('questions')
    .select(
      `
        question_data
      `
    )
    .eq('quiz_id', quizId)
    .limit(20)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    throw error;
  }
  return data ?? [];
};

export const fetchMessages = async (
  supabase: SupabaseClient<any, 'public', any>,
  quizId: string
) => {
  const { data, error } = await supabase
    .from('messages')
    .select(
      `
      message,
      type
    `
    )
    .eq('quiz_id', quizId)
    .limit(10)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error:', error);
    throw error;
  }
  return data ?? [];
};

export async function isAuthenticated(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ user: any; error?: any }> {
  const supabaseServerClient = createServerSupabaseClient({ req, res });
  const { data, error } = await supabaseServerClient.auth.getUser();

  if (!data.user || error) {
    return { user: null, error: error };
  }

  return { user: data.user };
}

type PageAuthOptions = {
  redirectTo: string;
};

// GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
// withServerAuth.ts
// import { NextApiRequest, NextApiResponse } from 'next';

// authenticateUser.ts

export async function authenticateUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabaseServerClient = createServerSupabaseClient({ req, res });
  const { data, error } = await supabaseServerClient.auth.getUser();

  if (!data?.user || error) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    };
  }

  return { user: data.user, client: supabaseServerClient };
}

export function withPageAuth(
  options: PageAuthOptions,
  callback?: (ctx: any, supabaseServerClient: any) => Promise<any>
) {
  return async (ctx: { req: NextApiRequest; res: NextApiResponse }) => {
    const { req, res } = ctx;
    const supabaseServerClient = createServerSupabaseClient({ req, res });
    const { data, error } = await supabaseServerClient.auth.getUser();

    if (!data?.user || error) {
      return {
        redirect: {
          destination: options.redirectTo,
          permanent: false
        }
      };
    }

    if (callback) {
      return await callback(ctx, supabaseServerClient);
    }

    // If no callback is provided, just return props (or adjust as needed)
    return { props: {} };
  };
}

export const getQuiz = async (
  quizId: string,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const supabaseServerClient = createServerSupabaseClient({ req, res });

  const { data, error } = await supabaseServerClient
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
