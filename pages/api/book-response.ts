import { NextApiRequest, NextApiResponse } from 'next';
import { generateMultipleChoiceFullPrompt } from '../../prompts/quiz-generator/multiple-choice-sys-mes';
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
import {
  quizIntentionPrompt,
  questionPrompt
} from 'prompts/book-generator/subprompts/check-message-type';

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const supabaseServerClient = createServerSupabaseClient({ req, res });

      const { message, quizId, quizType, topicId } =
        (await req.body) as RequestData;

      await saveMessage(supabaseServerClient, message, topicId, 'user');

      const llmGpt4 = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.7,
        modelName: 'gpt-3.5-turbo-16k'
      });

      const prompt = quizIntentionPrompt(message);
      const result = await llmGpt4.predict(prompt);

      console.log("result",result)

      // Parsing the response
      const parsedResponse = JSON.parse(result);

      const aiResponse = parsedResponse.ai_response;
      const promptQuestions = parsedResponse.questions;


      const questionsPromises: Promise<any>[] = [];

      // Looping through the questions to get answers from AI and store them in questionsArray
      for (const question of promptQuestions) {
        const questionPrompt_ = questionPrompt(question);
        const questionPromise = llmGpt4
          .predict(questionPrompt_)
          .then((result) => {
            const questionResponse = JSON.parse(result); // Assuming your questionPrompt expects a structured JSON response
            return questionResponse; // You might need to adjust this if the structure is nested
          });
        questionsPromises.push(questionPromise);
      }

      // Wait for all the questions to be processed
      const questionsArray = await Promise.all(questionsPromises);

      //LOOP THROU
        await insertQuestions(
          supabaseServerClient,
          questionsArray,
          topicId,
          quizType
        );


      if (aiResponse) {
        await saveMessage(
          supabaseServerClient,
          aiResponse,
          topicId,
          'ai'
        );
      }



      // Structuring the final response
      const response = {
        message: aiResponse,
        questions: questionsArray
      };

      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: {
          message: error?.message ?? 'Internal Server Error'
        }
      });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default apiHandler;
