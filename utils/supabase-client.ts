import {
  createBrowserSupabaseClient,
  User
} from '@supabase/auth-helpers-nextjs';
import { ProductWithPrice } from 'types/types';
import type { Database } from 'types/types_db';
import { isQuestion } from 'types/type_guards';
import { Question } from 'types/types';
import { postData } from './helpers';

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
    image_url,
    quizzes_snapshot(
      topics_order
    )
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

export const deleteAllQuestionsOfTopic = async (topicId: string) => {
  const { data, error } = await supabase
    .from('questions')
    .delete()
    .eq('topic_id', topicId);

  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const getTopicPrompt = async (topicId: string) => {
  const { data, error } = await supabase
    .from('topics')
    .select('prompt')
    .eq('id', topicId)
    .single();

  console.log('data', data);
  if (error) {
    console.log(error.message);
    throw error;
  }

  return data ?? [];
};

export const getOneQuestionFromTopic = async (topicId: string) => {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId)
    .limit(1);

  if (error) {
    console.error('Error:', error);
    throw error;
  }

  return data ?? [];
};

// export const generateAQuizForEachTopic = async (
//   topics: string[],
//   quizId: string
// ) => {
//   // Create an array of promises for each topic
//   const promises = topics.map(async (topicId) => {
//     const questions = await getOneQuestionFromTopic(topicId);
//     if (questions.length > 0) {
//       return;
//     }

//     const result = await getTopicPrompt(topicId);
//     return postData({
//       url: '/api/book-response',
//       data: {
//         message: result.prompt,
//         quizId,
//         topicId
//       }
//     });
//   });

//   // Wait for all promises to complete
//   await Promise.all(promises);
// };

// export const generateAQuizForEachTopic = async (
//   topics: string[],
//   quizId: string,
//   quizType: string
// ) => {
//   let count = 0;

//   for (const topicId of topics) {
//     const questions = await getOneQuestionFromTopic(topicId);
//     if (questions.length === 0) {
//       count++;
//       console.log('count', count);

//       const result = await getTopicPrompt(topicId);
//       // await createQuiz(result.prompt, quizType, topicId);
//     }
//   }
// };

// export const generateAQuizForEachTopic = async (
//   topics: string[],
//   quizId: string,
//   quizType: string
// ) => {
//   var count = 0;
//   // Create an array of promises for each topic
//   const promises = topics.map(async (topicId) => {
//     const questions = await getOneQuestionFromTopic(topicId);
//     if (questions.length > 0) {
//       return;
//     }
//     count++;
//     console.log('count', count);

//     const result = await getTopicPrompt(topicId);
//     const response = await createQuiz(result.prompt, quizType, topicId);

//     // Return the response, or any other logic you want to execute after the quiz is created
//     return response;
//   });

//   // Wait for all promises to complete
//   await Promise.all(promises);
// };
const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  let index = 0;
  const arrayLength = array.length;
  const chunks = [];

  while (index < arrayLength) {
    chunks.push(array.slice(index, chunkSize + index));
    index += chunkSize;
  }

  return chunks;
};

export const generateAQuizForEachTopic = async (
  topics: string[],
  quizId: string,
  quizType: string
) => {
  const processChunk = async (chunk: string[]) => {
    var count = 0;
    const promises = chunk.map(async (topicId) => {
      const questions = await getOneQuestionFromTopic(topicId);
      if (questions.length > 0) {
        return;
      }
      count++;
      console.log('count', count);

      const result = await getTopicPrompt(topicId);
      const response = await createQuiz(result.prompt, quizType, topicId);
      return response;
    });

    await Promise.all(promises);
  };

  const chunks = chunkArray(topics, 5);
  for (const chunk of chunks) {
    await processChunk(chunk);
  }
};

export const countTopicsWithNoQuestions = async (quiz_id: string) => {
  const { data, error } = await supabase.rpc('topics_without_questions', {
    p_quiz_id: quiz_id
  });

  if (error) {
    console.log(error.message);
    throw error;
  }


  return data ?? [];
};

export const deleteAllQuizQuestions = async (topics: string[]) => {
  for (const topic of topics) {
    const { data, error } = await supabase
      .from('questions')
      .delete()
      .eq('topic_id', topic);
  }
};

// import { saveTopicPrompt } from '../../utils/supabase-server';
import { OpenAI } from 'langchain/llms/openai';
import { generateQuizAndTitle } from 'prompts/book-generator/subprompts/check-message-type';

export const insertQuestions = async (
  questions: Question[],
  topicId: string,
  quizType: string
) => {
  const { data, error } = await supabase.from('questions').insert(
    questions.map((question) => {
      return {
        topic_id: topicId,
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

export const createQuiz = async (message: any, quizType: any, topicId: any) => {
  try {


    const llmGpt4 = new OpenAI({
      openAIApiKey: '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', ///process.env.OPENAI_API_KEY,
      temperature: 0.7,
      modelName: 'gpt-4'
    });

    const prompt = generateQuizAndTitle(message);
    const result = await llmGpt4.predict(prompt);

    const parsedResponse = JSON.parse(result);

    const promptQuestions = parsedResponse.questions;
    const title = parsedResponse.title;

    await editTopicTitle(topicId, title);
    //LOOP THROU
    await insertQuestions(promptQuestions, topicId, quizType);

    const response = {
      message: title,
      questions: promptQuestions
    };
    return response;
  } catch (error: any) {
    console.error(error);
  }
};

export const deleteAllTopics = async (quizId: string) => {
  const { data, error } = await supabase
    .from('topics')
    .delete()
    .eq('quiz_id', quizId);

  //delete topics order
  const { data: data2, error: error2 } = await supabase
    .from('quizzes')
    .update({ topics_order: [] })
    .eq('id', quizId);

  if (error) {
    console.log(error.message);
    throw error;
  }

  if (error2) {
    console.log(error2.message);
    throw error2;
  }

  return data ?? [];
};