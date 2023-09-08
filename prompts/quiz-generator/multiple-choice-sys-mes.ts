import { introAndSystemMessage, rules, history } from './subprompts/common';
import { TrueOrFalseQuizPrompt, multipleChoizeQuizPrompt } from './subprompts/quiz-type';
import { trueFalseMathSample, sampleMultipleChoiceExample, sampleUserInputMath, sampleUserInputTopic, sampleUserInputGreeting, sampleUserInputCodingWithCodeblockAnswer } from './subprompts/samples';

import {mathNotationInstructions, codeNotation} from './subprompts/notations'

export const generateMultipleChoiceFullPrompt = (
  past_questions: string,
  message: string,
) => {
  return (
    introAndSystemMessage(message) +
    multipleChoizeQuizPrompt() +
    rules() +
    // mathNotationInstructions() +
    // codeNotation() +
    sampleMultipleChoiceExample() +
    // sampleUserInputGreeting() +
    // sampleUserInputTopic() +
    // sampleUserInputMath() +
    // sampleUserInputCodingWithCodeblockAnswer()
    + history(past_questions)
  );
};

