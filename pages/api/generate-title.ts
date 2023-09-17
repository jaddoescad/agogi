import { NextApiRequest, NextApiResponse } from 'next';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { RequestData } from 'types/types';
import { OpenAI } from 'langchain/llms/openai';
import { generateTitle } from '../../prompts/book-generator/subprompts/generate-title';
import { editTopicTitle } from '../../utils/supabase-server';

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const supabaseServerClient = createServerSupabaseClient({ req, res });

      const { prompt, quizId, quizType, topicId } =
        (await req.body) as RequestData;

      const llmGpt4 = new OpenAI({
        openAIApiKey: process.env.OPENAI_API_KEY,
        temperature: 0.7,
        modelName: 'gpt-3.5-turbo-16k'
      });

      const titlePrompt = generateTitle(prompt);
      const result = await llmGpt4.predict(titlePrompt);

      await editTopicTitle(topicId, result, supabaseServerClient);

      return res.status(200).json(result);
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
