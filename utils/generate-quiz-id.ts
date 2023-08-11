import { v4 as uuidv4 } from 'uuid';
import va from '@vercel/analytics';

export const generateQuizID = () => {
  const quizUUID = uuidv4();
  va.track('generate-quiz-clicked');
  return `/generate/${quizUUID}`;
};
