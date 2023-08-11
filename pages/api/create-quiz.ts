import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { addQuizAndQuestions } from '../../utils/supabase-server';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

const processRequestData = async (req: NextApiRequest) => {
  if (req.method !== 'POST') {
    throw new Error('Method Not Allowed');
  }

  const {
    difficulty,
    numberOfQuestions,
    userId,
    model,
    description
  }: {
    difficulty: string;
    numberOfQuestions: string;
    userId: string;
    model: string;
    description?: string;
  } = await req.body;

  if (!difficulty || !numberOfQuestions) {
    throw new Error('Missing required parameters.');
  }

  return {
    difficulty,
    numberOfQuestions,
    userId,
    model: 'gpt-3.5-turbo-16k',
    description
  };
};

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const supabaseServerClient = createServerSupabaseClient({ req, res });

    const requestData = await processRequestData(req);
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY // Use the GPT Key from client request
    });

    const openai = new OpenAIApi(configuration);

    const skeleton = `{
          "difficulty": "",
          "title": "",
          "questions": [
              {
                  "question": "",
                  "type": "true/false",
                  "correctAnswer": true
              },
              {
                  "question": "",
                  "type": "true/false",
                  "correctAnswer": false
              },
              ...
          ]
        };`;


    const systemMessages = {
      Easy: `You are a True or False quiz generator. Generate a list of true or false questions. The questions should be relatively easy.`,
      Medium: `You are a True or False quiz generator. Generate a list of true or false questions. The questions should be of medium difficulty. It should challenge the user to think, but not be too difficult.`,
      Hard: `As a powerful AI, generate an extremely challenging True or False quiz focusing on advanced, nuanced, and less-known concepts.
        `
    };

    const difficultyMessage =
      systemMessages[requestData.difficulty as 'Easy' | 'Medium' | 'Hard'];
    if (!difficultyMessage) {
      throw new Error('Invalid difficulty level.');
    }

    const response = await openai.createChatCompletion({
      model: requestData.model,
      messages: [
        {
          role: 'system',
          content: `${difficultyMessage}\n\nFormat:${skeleton}\n\n\nonly generate a json, do not write anything else.\n, ask true/false questions that require knowledge of the topic. generate title from description, do not use the word quiz in the title or do not mention difficulty, just give a concise title on the topic. Every word in the title is crucial do not use filler words.
          
          for example:
          description: "generate a complex quiz on the topic of the history of the united states and the civil war"
          title: "The History of the United States and the Civil War"
          `
        },
        {
          role: 'user',
          content: JSON.stringify({
            difficulty: requestData.difficulty,
            numberOfQuestions: requestData.numberOfQuestions,
            description: requestData.description
          })
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    // console.log(response)

    console.log('success getting openai message');

    if (!response?.data?.choices[0]?.message?.content) {
      throw new Error('Quiz generation failed.');
    }

    const quiz = JSON.parse(response.data.choices[0].message.content as string);
    quiz.description = requestData.description;
    quiz.model = requestData.model;

    const quizId = await addQuizAndQuestions(quiz, supabaseServerClient);

    console.log('quiz added successfully', quizId);

    res.status(200).json({ quizId: quizId });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error);

      let status = 500;
      let message = 'Internal Server Error';

      if (error.message === 'Method Not Allowed') {
        status = 405;
      } else if (error.message.includes('Missing required parameters')) {
        status = 400;
      } else if (error.message.includes('Invalid model name')) {
        status = 400;
      } else if (error.message.includes('Quiz generation failed')) {
        status = 400;
      }

      res.status(status).json({ error: message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export default apiHandler;


