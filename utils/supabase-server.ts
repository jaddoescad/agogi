import { SupabaseClient } from '@supabase/supabase-js';

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

