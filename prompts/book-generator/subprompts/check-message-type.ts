// export const quizIntentionPrompt = (message: string) => {
//     return `

//     You are a quiz generator that specializes in generating quizzes on long texts from books. The Text we would like to generate questions from is under below is the text.
//     Objective: Respond with a JSON structure by generating a quiz providing an array of 15 questions on the topic they specify.

// Rules:
// 1. Questions should test comprehension of themes and concepts of the text below.
// 2. Respond in JSON format.
// 3. Questions should be stored in a "questions" array.
// 4. Cover different parts of the text.
// 5. Avoid questions about the book's title, its author, the final message, or chapter name.
// 6. Ensure diversity in the questions.
// 7. do not provide any answers to the questions.
// 8. do not write Expected Response: only the json. or anything except the json.
// 9. do not write anything else except the json.
// 10. do not add ... to the json.

// Example of Expected Response:
// {
//     "questions": [
//        "What is the focus of the Israeli military Cyber Intelligence Unit in Beersheba?",
//        "What is the significance of Beersheba becoming a major global cybertech hub?",
//        "How does the human body decode reality?",
//        ...

//     ]
// }

// DO NOT ASK Superficial QUESTIONS LIKE THIS:
// What is the title of the book mentioned in the text?
// Who wrote the book mentioned in the text?
// What is the final message conveyed in the text?
// What is the title of the chapter?
// What is the focus of the text?

// Text to generate questions from:

// ${message}`;
// }

// export const questionPrompt = (question: string) => {
//     return `
// Objective: Create a question-answer structure based on the provided question and choices. Identify the correct answer and present it as the index of the choices.

// Rules
// 1. Ensure the answer is accurate and aligns with the format provided.
// 2. Ensure the question is relevant and high quality.
// 3. provide your response in a JSON format.
// 4. do not write Expected Response: only the json. or anything except the json.

// Example 1
// Question: Which of the above choices is the correct answer to the provided question?

// Note: Respond with the format as shown in the example:
// {
//     "question": "Which gas do plants absorb from the atmosphere during photosynthesis?",
//     "type": "multiple-choice",
//     "choices": ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"],
//     "correctAnswer": 1
// }

// {
//     "question": "Who wrote the play 'Romeo and Juliet'?",
//     "type": "multiple-choice",
//     "choices": ["William Wordsworth", "Jane Austen", "Charles Dickens", "William Shakespeare"],
//     "correctAnswer": 3
// }

// {
//     "question": "Which of these animals is a mammal?",
//     "type": "multiple-choice",
//     "choices": ["Shark", "Frog", "Dolphin", "Eagle"],
//     "correctAnswer": 2
// }

// {
//     "question": "Which planet is known as the 'Red Planet'?",
//     "type": "multiple-choice",
//     "choices": ["Mars", "Venus", "Jupiter", "Saturn"],
//     "correctAnswer": 0
// }

// Below is the question:
// Question: ${question}
// `;

// }

// export const generateQuizAndTitle = (text: string) => {
//   return `
// Objective: Extract deep insights from the provided text and create a quiz that tests detailed comprehension, main ideas, and application of core concepts. 

// Guidelines:
// 1. Title: Generate a title that captures the essence and main concepts of the text.
// 2. Questions: Aim for depth and avoid superficial queries. Questions should:
//    - Test understanding of key concepts and details.
//    - Span across different parts of the text.
//    - Be unambiguous, with one clear answer.
// 3. Responses:
//    - Render your output in JSON format.
//    - Keep all questions within a "questions" array.
//    - No extraneous content outside the JSON structure.
//    - Do not truncate or use "..." within the JSON.
// 4. Prohibited Queries: Refrain from asking about the book's title, author, final message, or chapter titles.

// Example:
// {
//     "title": "The Nuances of Cybersecurity",
//     "questions": [
//         {
//             "question": "How does the Cyber Intelligence Unit in Region-X prioritize threats?",
//             "type": "multiple-choice",
//             "choices": ["Severity", "Frequency", "Random Sampling", "Public Concern"],
//             "correctAnswer": 0
//         },
//         ...
//     ]
// }

// Focus on questions that test comprehension of the text's main ideas and concepts with a lot of depth. 

// Text to be Quizzed:

// ${text}
// `;
// };

export const generateQuizAndTitle = (text: string) => {
  return `
        Objective: Generate 15 high-quality questions from the provided text that delve into its core concepts, nuances, and applications.

        Guidelines:
        1. **Title**: Generate a title that encapsulates the core concepts and themes of the text.
        2. **Questions**:
        - Must promote critical thinking and comprehension.
        - Should capture the subtleties and intricacies of the text.
        - Need to be distributed evenly across the text, ensuring comprehensive coverage.
        - type is always multiple-choice
        - generate 4 choices for each question
        - Example: For a text discussing the economic impact of climate change, a high-quality question might be: "Which sector is predicted to face the highest economic cost due to rising sea levels and why?"
        3. **Responses**:
        - Present in JSON format.
        - Use a "questions" array for all questions.
        - Ensure clarity and precision in the answer choices.
        - Example Structure:
        {
            "title": "The Economic Impact of Climate Change",
            "questions": [{
                "question": "What factors contribute to economic disparities in Region Y due to climate change?",
                "type": "multiple-choice",
                "choices": ["Government Policies", "Physical Infrastructure", "Educational Opportunities", "All of the above"],
                "correctAnswer": 2
            },
            ...
            ]
            }
        4. **Avoidance Criteria**: Do not inquire about the text's title, author, conclusive remarks, or chapter names.

        Focus on crafting questions that dive deep into the essence of the text, testing both detailed understanding and broad comprehension.

        Text to be Analyzed:

        ${text}
`;
};
