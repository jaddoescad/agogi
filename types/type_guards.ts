import { Question } from '../types/types';

export function isQuestion(data: any): data is Question {
    if (typeof data.question !== 'string' || typeof data.type !== 'string') {
      return false;
    }
  
    switch (data.type) {
      case 'true-false':
        return typeof data.correctAnswer === 'boolean';
  
      case 'multiple-choice':
        return (
          Array.isArray(data.choices) &&
          data.choices.every((choice: any) => typeof choice === 'string') &&
          typeof data.correctAnswer === 'string'
        );
  
      default:
        return false;
    }
  }