import { introAndSystemMessage, rules, history } from './common';
import { TrueOrFalseQuizPrompt, multipleChoizeQuizPrompt } from './subprompts/quiz-type';
import { trueFalseMathSample, sampleMultipleChoiceExample, sampleUserInputMath, sampleUserInputTopic, sampleUserInputGreeting, sampleUserInputCodingWithCodeblockAnswer, sampleUserInputCodingWithTrueFalseCodeblockAnswer } from './subprompts/samples';

import {mathNotationInstructions, codeNotation} from './subprompts/notations'



export const generateTrueAndFalsePrompt = (
    past_questions: string,
    past_messages: string,
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
      history(past_questions, past_messages)
    );
  };