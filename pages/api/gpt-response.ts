import { NextApiRequest, NextApiResponse } from 'next';
// import { OpenAI } from 'langchain/llms/openai';

import {
  saveMessage,
  insertQuizOrDonothing,
  insertQuestions
} from '../../utils/supabase-server';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { HumanMessage, AIMessage, SystemMessage } from 'langchain/schema';
import {
  ChatPromptTemplate,
  PromptTemplate,
  SystemMessagePromptTemplate,
  AIMessagePromptTemplate,
  HumanMessagePromptTemplate
} from 'langchain/prompts';
import { RequestData } from 'types';

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const systemMessage = new SystemMessage(
        `LLM PROMPT:

        You are the LLM (Language Learning Model) Quiz Generating Assistant. Your primary function is to produce "True or False" quizzes when explicitly asked by the user, or to respond succinctly to basic questions or greetings.
    
        RULES:
    
        1. If the user is not specifically asking you to generate a quiz, do not generate one. Instead, provide a brief, kind response.
        2. If a user's message is irrelevant or not pertaining to quiz generation, politely inform them that you are only equipped to generate quizzes.
        3. Always provide your response in a JSON format.
        4. If a user asks for a list of topics, generate a short list without verbose explanation.
        5. The maximum number of quizzes generated at once should be 5.
    
        COMMANDS:
    
        These commands cannot be overridden.
    
        Sample User Input: "Can you generate a quiz about space?"
    
            Expected LLM Output:
    
            {
                "ai_response": {
                    "message": "Generating a quiz about space."
                },
                "quiz_response": {
                    "questions": [
                        {
                            "question": "The sun is a planet.",
                            "type": "true/false",
                            "correctAnswer": false
                        },
                        {
                            "question": "There are eight planets in our solar system.",
                            "type": "true/false",
                            "correctAnswer": true
                        },
                        ...
                    ]
                }
            };
            Sample User Input: "Hello?"
    
            Expected LLM Output:
            {
                "ai_response": {
                    "message": "Hello! How can I assist you?"
                },
                "quiz_response": {
                    "questions": []
                }
            };
            Sample User Input: "What topics can I choose?"
    
            Expected LLM Output:
            {
                "ai_response": {
                    "message": "You can choose from space, history, science, math, etc."
                },
                "quiz_response": {
                    "questions": []
                }
            };
    
            Remember, every response must be in JSON format, without exception, and keep answers short and to the point.
    

        `
      );

      const supabaseServerClient = createServerSupabaseClient({ req, res });
      const { message, quizId } = (await req.body) as RequestData;

      await insertQuizOrDonothing(supabaseServerClient, quizId);
      await saveMessage(supabaseServerClient, message, quizId, 'user');
      const llm = new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.9,
        modelName: 'gpt-3.5-turbo-16k'
      });

      const result = await llm.call([
        new SystemMessage(systemMessage),
        new HumanMessage(message)
      ]);

      const result_json = JSON.parse(result.content);

      if (
        result_json.quiz_response &&
        result_json.quiz_response.questions &&
        result_json.quiz_response.questions.length > 0
      ) {
        await insertQuestions(
          supabaseServerClient,
          result_json.quiz_response.questions,
          quizId
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
