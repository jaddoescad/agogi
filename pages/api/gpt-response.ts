import { NextApiRequest, NextApiResponse } from 'next';
import { generateMultipleChoiceFullPrompt } from '../../prompts/multiple-choice-sys-mes';
import { generateTrueAndFalsePrompt } from '../../prompts/true-false-sys-mes';
import {
  saveMessage,
  insertQuizOrDonothing,
  insertQuestions
} from '../../utils/supabase-server';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { RequestData } from 'types/types';
import { fetchQuestions, fetchMessages } from '../../utils/supabase-server';
import { OpenAI } from 'langchain/llms/openai';
import { v4 as uuidv4 } from 'uuid';

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const supabaseServerClient = createServerSupabaseClient({ req, res });

    const llm = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.7,
      modelName: 'gpt-3.5-turbo-16k'
    });

    const { message, quizId, quizType } = (await req.body) as RequestData;

    try {
      await insertQuizOrDonothing(supabaseServerClient, quizId);
      await saveMessage(supabaseServerClient, message, quizId, 'user');
      const questions = await fetchQuestions(supabaseServerClient, quizId);
      const messages = await fetchMessages(supabaseServerClient, quizId);

      var prompt;
      const past_questions = JSON.stringify(questions);
      const past_messages = JSON.stringify(messages);

      const prompt = 
      quizType ?
      generateMultipleChoiceFullPrompt(
        past_questions,
        past_messages,
        message,
      ) :
      generateTrueAndFalsePrompt(
        past_questions,
        past_messages,
        message,
      );

      const result = await llm.predict(prompt);
      const result_json = JSON.parse(result);
      for (let q of result_json.quiz_response.questions) {
        q.id = uuidv4(); // Generating and attaching a UUID to each question
    }

      if (
        result_json.quiz_response &&
        result_json.quiz_response.questions &&
        result_json.quiz_response.questions.length > 0
      ) {
        await insertQuestions(
          supabaseServerClient,
          result_json.quiz_response.questions,
          quizId,
          quizType
        );
      }


      if (result_json.ai_response) {
        await saveMessage(
          supabaseServerClient,
          result_json.ai_response.message,
          quizId,
          'ai'
        );
      }

      res.status(200).json(result_json);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({
        error: {
          message: err?.message ?? 'Internal Server Error'
        }
      });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default apiHandler;