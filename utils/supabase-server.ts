import { SupabaseClient } from '@supabase/supabase-js';
import {Question} from '../types/types';

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

  const { data, error } = await supabase
    .from('questions')
    .insert(
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
    .eq('quiz_id', quizId);

  if (error) {
    console.error('Error:', error);
    throw error;
  }
  return data ?? [];
}

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
}