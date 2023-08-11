import { SupabaseClient } from '@supabase/supabase-js';
import {QuestionData} from '../types';

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
  questions: [QuestionData],
  quidId: string
) => {

  const { data, error } = await supabase
    .from('questions')
    .insert(
      questions.map((question) => {
        return {
          quiz_id: quidId,
          question_data: question
        };
      })
    );

  if (error) {
    console.error('Error:', error);
    throw error;
  }

  return data ?? [];
};