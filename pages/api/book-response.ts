// import { NextApiRequest, NextApiResponse } from 'next';
// import { generateMultipleChoiceFullPrompt } from '../../prompts/quiz-generator/multiple-choice-sys-mes';
// import { generateTrueAndFalsePrompt } from '../../prompts/true-false-sys-mes';
// import {
//   insertQuizOrDonothing,
//   insertQuestions
// } from '../../utils/supabase-server';
// import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
// import { RequestData } from 'types/types';
// import { fetchQuestions, saveTopicPrompt } from '../../utils/supabase-server';
// import { OpenAI } from 'langchain/llms/openai';
// import {
//   quizIntentionPrompt,
//   questionPrompt
// } from 'prompts/book-generator/subprompts/check-message-type';

// const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     try {
//       const supabaseServerClient = createServerSupabaseClient({ req, res });
//       console.log('supabase server initialized');

//       const { message, quizId, quizType, topicId } =
//         (await req.body) as RequestData;

//       saveTopicPrompt(topicId, message, supabaseServerClient);

//       const llmGpt4 = new OpenAI({
//         openAIApiKey: process.env.OPENAI_API_KEY,
//         temperature: 0.7,
//         modelName: 'gpt-3.5-turbo-16k'
//       });

//       const prompt = quizIntentionPrompt(message);
//       const result = await llmGpt4.predict(prompt);

//       // Parsing the response
//       const parsedResponse = JSON.parse(result);
//       console.log('parsedResponse', parsedResponse);

//       const aiResponse = parsedResponse.ai_response;
//       const promptQuestions = parsedResponse.questions;

//       const questionsPromises: Promise<any>[] = [];

//       // Looping through the questions to get answers from AI and store them in questionsArray
//       for (const question of promptQuestions) {
//         const questionPrompt_ = questionPrompt(question);
//         const questionPromise = llmGpt4
//           .predict(questionPrompt_)
//           .then((result) => {
//             const questionResponse = JSON.parse(result); // Assuming your questionPrompt expects a structured JSON response
//             return questionResponse; // You might need to adjust this if the structure is nested
//           });
//         questionsPromises.push(questionPromise);
//       }

//       // Wait for all the questions to be processed
//       const questionsArray = await Promise.all(questionsPromises);

//       // console.log('questionsArray', questionsArray);

//       //LOOP THROU
//         await insertQuestions(
//           supabaseServerClient,
//           questionsArray,
//           topicId,
//           quizType
//         );

//       const response = {
//         message: aiResponse,
//         questions: questionsArray
//       };

//       // console.log('response', response);

//       return res.status(200).json(response);
//     } catch (error: any) {
//       console.error(error);
//       res.status(500).json({
//         error: {
//           message: error?.message ?? 'Internal Server Error'
//         }
//       });
//     }
//   } else {
//     res.setHeader('Allow', 'POST');
//     res.status(405).end('Method Not Allowed');
//   }
// };

// export default apiHandler;

import { NextApiRequest, NextApiResponse } from 'next';
import { insertQuestions } from '../../utils/supabase-server';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { RequestData } from 'types/types';
import { saveTopicPrompt, editTopicTitle } from '../../utils/supabase-server';
import { OpenAI } from 'langchain/llms/openai';
import { generateQuizAndTitle } from 'prompts/book-generator/subprompts/check-message-type';

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const supabaseServerClient = createServerSupabaseClient({ req, res });
      console.log('supabase server initialized');

      const { message, quizId, quizType, topicId } =
        (await req.body) as RequestData;

      saveTopicPrompt(topicId, message, supabaseServerClient);
      console.log('topic saved');

      const llmGpt4 = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.7,
        modelName: 'gpt-4'
      });

      const prompt = generateQuizAndTitle(message);
      const result = await llmGpt4.predict(prompt);

      // Parsing the response
      const parsedResponse = JSON.parse(result);
      console.log('parsedResponse', parsedResponse);

      const promptQuestions = parsedResponse.questions;
      const title = parsedResponse.title;

      await editTopicTitle(topicId, title, supabaseServerClient);

      //LOOP THROU
      await insertQuestions(
        supabaseServerClient,
        promptQuestions,
        topicId,
        quizType
      );

      const response = {
        message: title,
        questions: promptQuestions
      };

      // console.log('response', response);

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
