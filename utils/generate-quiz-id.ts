import { v4 as uuidv4 } from 'uuid';
import { trackVercel } from '@/utils/analytics';

export const generateQuizID = () => {
  const quizUUID = uuidv4();
  trackVercel('generate-quiz-clicked');
  return `/${quizUUID}`;
};
