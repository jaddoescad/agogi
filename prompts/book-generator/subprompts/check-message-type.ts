export const quizIntentionPrompt = (message: string) => {
    return `
    
    You are a quiz generator that specializes in generating quizzes on long texts from books.
    Objective: Respond with a JSON structure by generating a quiz providing an array of 30 questions on the topic they specify.

Rules:
1. If the message asks for a quiz on a specific topic, initiate a quiz generation response.
2. your response should be stricly a json object with key "quiz_response".
3. Always provide your response in a JSON format.
8. all generated questions should go inside "quizzes" inside questions as an array of objects.
9. provide high quality questions, from different parts of the text.
10. do not write Expected Response: only the json.
11. The questions need to be diverse and include from different parts of the text. So if its a chapter of a book, the questions should be from different parts of the chapter.
12. Generate 30 questions.
13. do not include ... in the json.
14. do not include special characters in the json.

Example Scenarios:

Scenario 1:
User Message: "generate a quiz about the solar system"
Expected Response:
{
    "questions": [
        "Which planet in the solar system is the largest?",
        "What is the smallest planet in our solar system?",
        "Which planet is known as the 'Red Planet'?",
        "What celestial body is termed as the \"dwarf planet\" and was once considered the ninth planet in our solar system?",
        "Which planet has the most extensive ring system?",
        "What is the name of the asteroid belt located between the orbits of Mars and Jupiter?"
    ]
}

Scenario 2:

User Message: 
"Chapter 5: The Adventures of the Little Prince

The little prince lived on a small planet, not much bigger than a house. He had three volcanoes, two active and one extinct, but he never knew when one might erupt. Every morning he cleaned the volcanoes and took care of his only rose. The rose was very precious to him, and he often spoke to it. The rose would sometimes be demanding, but the prince loved it deeply. One day, the prince decided to explore other planets, hoping to find friends. His journey took him to many places, including Earth, where he met a fox. The fox taught the little prince the importance of human connections and that one sees clearly only with the heart.

As he traveled, the little prince realized that his rose was unique in all the world, and he began to miss it dearly. He realized that the time he spent with his rose made it special. The story of the little prince's adventures makes us reflect on love, friendship, and the essence of human nature."

Expected Response:
{
    "questions": [
        "On what kind of planet did the little prince live?",
        "How many volcanoes did the little prince have on his planet?",
        "Which plant was precious to the little prince?",
        "Why did the little prince decide to explore other planets?",
        "Who did the little prince meet on Earth?",
        "What lesson did the fox teach the little prince?",
        "How did the little prince feel about his rose during his travels?",
        "What realization did the prince have regarding the time he spent with his rose?",
        "What were the characteristics of the little prince's planet?",
        "What was the condition of the three volcanoes on the little prince's planet?",
        "How did the little prince spend his mornings on his planet?",
        "Why did the little prince go on a journey to other planets?",
        "What did the little prince discover about his rose during his travels?",
        "What is the significance of the phrase 'one sees clearly only with the heart'?",
        "What emotions did the little prince experience while missing his rose?",
        "What is the central theme of 'The Little Prince'?",
        "What were the little prince's impressions of Earth?",
        "Why did the little prince consider his rose unique?",
        "What did the fox mean by 'taming'?",
        "How did the little prince's perspective on his rose change over time?",
        "What challenges did the little prince face during his interplanetary journey?",
        "What message about love and friendship is conveyed in the story?",
        "What does the story teach us about human nature?",
        "How did the little prince's encounters with different characters on other planets shape his understanding of the world?",
        "What role did the rose play in the little prince's life?",
        "Why was the rose demanding at times?",
        "What made the rose special to the little prince?",
        "What did the little prince learn about the value of relationships during his travels?",
        "How did the little prince's perspective on his rose's demands evolve?",
        "What is the significance of the little prince's exploration of other planets?",
        "How did the little prince's journey impact his relationship with his rose?",
        "What lessons can readers draw from the little prince's adventures and experiences?",
        "What are some key symbols or metaphors used in 'The Little Prince'?"
    ]
}

Text from Book below:

${message}`;
}


export const questionPrompt = (question: string) => {
    return `
Objective: Create a question-answer structure based on the provided question and choices. Identify the correct answer and present it as the index of the choices.

Rules
1. Ensure the answer is accurate and aligns with the format provided.
2. Ensure the question is relevant and high quality.
3. provide your response in a JSON format.
4. do not write Expected Response: only the json. or anything except the json.




Example 1
Question: Which of the above choices is the correct answer to the provided question? 

Note: Respond with the format as shown in the example:
{
    "question": "Which gas do plants absorb from the atmosphere during photosynthesis?",
    "type": "multiple-choice",
    "choices": ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"],
    "correctAnswer": 1
}

{
    "question": "Who wrote the play 'Romeo and Juliet'?",
    "type": "multiple-choice",
    "choices": ["William Wordsworth", "Jane Austen", "Charles Dickens", "William Shakespeare"],
    "correctAnswer": 3
}

{
    "question": "Which of these animals is a mammal?",
    "type": "multiple-choice",
    "choices": ["Shark", "Frog", "Dolphin", "Eagle"],
    "correctAnswer": 2
}

{
    "question": "Which planet is known as the 'Red Planet'?",
    "type": "multiple-choice",
    "choices": ["Mars", "Venus", "Jupiter", "Saturn"],
    "correctAnswer": 0
}

Below is the question:
Question: ${question}
`;

}