import { introAndSystemMessage, rules, history } from './quiz-generator/subprompts/common';
import { TrueOrFalseQuizPrompt, multipleChoizeQuizPrompt } from './quiz-generator/subprompts/quiz-type';
import { trueFalseMathSample, sampleMultipleChoiceExample, sampleUserInputMath, sampleUserInputTopic, sampleUserInputGreeting, sampleUserInputCodingWithCodeblockAnswer, sampleUserInputCodingWithTrueFalseCodeblockAnswer } from './quiz-generator/subprompts/samples';

import {mathNotationInstructions, codeNotation} from './quiz-generator/subprompts/notations'



export const generateTrueAndFalsePrompt = (
    past_questions: string,
    message: string,
  ) => {
    return (
      introAndSystemMessage(message) +
      TrueOrFalseQuizPrompt() +
      rules() +
      mathNotationInstructions() +
      codeNotation() +
      sampleUserInputTopic() +
      sampleUserInputGreeting() +
      trueFalseMathSample() +
      sampleUserInputCodingWithTrueFalseCodeblockAnswer()+
      history(past_questions)
    );
  };