import { Question } from '../types/types';

export function isQuestion(data: any): data is Question {
    return (
      typeof data.type === 'string' &&
      typeof data.question === 'string' &&
      typeof data.correctAnswer === 'boolean'
    );
  }