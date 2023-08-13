import { NextApiRequest, NextApiResponse } from 'next';
// import { OpenAI } from 'langchain/llms/openai';
import { trueFalseQuizGenSystemMessage } from '../../prompts/true-false-sys-mes';
import { multipleChoiceQuizGenSystemMessage } from '../../prompts/multiple-choice-sys-mes';
import {
  saveMessage,
  insertQuizOrDonothing,
  insertQuestions
} from '../../utils/supabase-server';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, AIMessage, SystemMessage } from 'langchain/schema';
import { RequestData } from 'types/types';
import { ConversationSummaryMemory } from 'langchain/memory';
import { OpenAI } from 'langchain/llms/openai';
import { fetchQuestions, fetchMessages } from '../../utils/supabase-server';
import {
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate
} from 'langchain/prompts';
import { MessagesPlaceholder } from 'langchain/prompts';

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const supabaseServerClient = createServerSupabaseClient({ req, res });
    const llm = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.9,
      modelName: 'gpt-4'
    });
    const { message, quizId, quizType } = (await req.body) as RequestData;

    try {
      await insertQuizOrDonothing(supabaseServerClient, quizId);
      await saveMessage(supabaseServerClient, message, quizId, 'user');
      const questions = await fetchQuestions(supabaseServerClient, quizId);
      const messages = await fetchMessages(supabaseServerClient, quizId);

      var prompt = trueFalseQuizGenSystemMessage;
      if (quizType === 'true/false') {
        prompt = trueFalseQuizGenSystemMessage;
      } else if (quizType === 'multiple-choice') {
        prompt = multipleChoiceQuizGenSystemMessage;
      }

      const systemMessagePrompt =
        SystemMessagePromptTemplate.fromTemplate(prompt);
    //   const humanMessagePrompt =
    //     HumanMessagePromptTemplate.fromTemplate(message);

      const chatPrompt = ChatPromptTemplate.fromPromptMessages([
        systemMessagePrompt,
        // humanMessagePrompt
      ]);


      const past_questions = JSON.stringify(questions);
      const past_messages = JSON.stringify(messages);

      const formattedChatPrompt = await chatPrompt.formatMessages({
        past_questions: past_questions ?? '[]',
        past_messages: past_messages ?? '[]'
      });

      const humanMessagePrompt = new HumanMessage(message)

      console.log('chat prompt', formattedChatPrompt[0]);
      console.log('chat prompt', formattedChatPrompt[1]);

      const result = await llm.call([...formattedChatPrompt, humanMessagePrompt]);

      console.log(result.content);

      const result_json = JSON.parse(result.content);

      console.log(result_json);

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
      console.log(err);
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
