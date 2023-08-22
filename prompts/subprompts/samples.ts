export const trueFalseMathSample = () => `
Sample User Input: "Can you generate a true/false math quiz with LaTeX notation?"

Expected LLM Output:

{
    "ai_response": {
        "message": "Generating a true/false math quiz with LaTeX notation."
    },
    "quiz_response": {
        "questions": [
            {
                "question": "The derivative of the function $$f(x) = x^3$$ is given by $$f'(x) = 3x^2$$.",
                "type": "true-false",
                "choices": ["True", "False"],
                "correctAnswer": 0
            },
            {
                "question": "The integral of $$f(x) = x^2$$ with respect to x is $$\int x^2 \, dx = \frac{1}{2} x^3 + C$$.",
                "type": "true-false",
                "choices": ["True", "False"],
                "correctAnswer": 1
            },
            ...
        ]
    }
}
`;

export const sampleUserInputTopic = () => `

    Sample User Input: "What topics can I choose?"

    Expected LLM Output:
    {
        "ai_response": {
            "message": "You can choose from space, history, science, math, etc."
        },
        "quiz_response": {
            "questions": []
        }
    }
    `


    export const trueFalseExample = () => `
Sample User Input: "Can you generate a true/false quiz about space?"

Expected LLM Output:

{
    "ai_response": {
        "message": "Generating a true/false quiz about space."
    },
    "quiz_response": {
        "questions": [
            {
                "question": "The Sun is a planet.",
                "type": "true-false",
                "choices": ["True", "False"],
                "correctAnswer": 1
            },
            {
                "question": "The Milky Way is a galaxy.",
                "type": "true-false",
                "choices": ["True", "False"],
                "correctAnswer": 0
            },
            ...
        ]
    }
}
`


export const sampleUserInputMath = () => `

 Sample User Input: "Can you generate a math quiz?"

Expected LLM Output:

{
    "ai_response": {
        "message": "Generating a math quiz."
    },
    "quiz_response": {
        "questions": [
            {
                "question": "What is the solution to the equation $$x^2 - 4x + 4 = 0$$?",
                "type": "multiple-choice",
                "choices": ["x = 1", "x = 2", "x = 3", "x = 4"],
                "correctAnswer": 1
            },
            {
                "question": "Which of the following is the derivative of the function $$f(x) = x^2$$?",
                "type": "multiple-choice",
                "choices": ["$f'(x) = 2x$", "$f'(x) = x^2$", "$f'(x) = 2x^2$", "$f'(x) = x$"],
                "correctAnswer": 0
            },
            ...
        ]
    }
}
`;


export const sampleUserInputGreeting = () => `
    Sample User Input: "Hello?"

    Expected LLM Output:
    {
        "ai_response": {
            "message": "Hello! How can I assist you?"
        },
        "quiz_response": {
            "questions": []
        }
    }

    `


export const sampleMultipleChoiceExample = () => `
Sample User Input: "Can you generate a quiz about space?"

    Expected LLM Output:

    {
        "ai_response": {
            "message": "Generating a quiz about space."
        },
        "quiz_response": {
            "questions": [
                {
                    "question": "Which is the star at the center of our solar system?",
                    "type": "multiple-choice",
                    "choices": ["Earth", "Venus", "Sun", "Moon"],
                    "correctAnswer": 2
                },
                {
                    "question": "How many planets are in our solar system?",
                    "type": "multiple-choice",
                    "choices": ["Six", "Seven", "Eight", "Nine"],
                    "correctAnswer": 2
                },
                ...
            ]
        }
    }
`
export const sampleUserInputCodingWithCodeblockAnswer = () => `
Sample User Input: "Can you generate a coding quiz about Python data structures?"

Expected LLM Output:

{
    "ai_response": {
        "message": "Generating a coding quiz about Python data structures."
    },
    "quiz_response": {
        "questions": [
            {
                "question": "In Python, which of the following lines of code will correctly print 'Hello, World!'?",
                "type": "multiple-choice",
                "choices": [
                    "<inlinecode>print('Hello, World!')</inlinecode>",
                    "<inlinecode>display('Hello, World!')</inlinecode>",
                    "<inlinecode>echo 'Hello, World!'</inlinecode>",
                    "<inlinecode>printf('Hello, World!')</inlinecode>"
                ],
                "correctAnswer": 0
            },
            {
                "question": "Complete the following code to define a Python function that adds two numbers:\n\n<codeblock>def add_two_numbers(a, b):\n    ???\n\nreturn add_two_numbers(2,3)</codeblock>",
                "type": "multiple-choice",
                "choices": [
                    "<inlinecode>return a + b</inlinecode>",
                    "<inlinecode>return a - b</inlinecode>",
                    "<codeblock>sum = a + b\nreturn sum</codeblock>",
                    "<codeblock>result = a * b\nreturn result</codeblock>"
                ],
                "correctAnswer": 0
            },
            {
                "question": "Given a Python list, which code block will return the first three elements of the list?",
                "type": "multiple-choice",
                "choices": [
                    "<codeblock>def get_first_three(list):\n    return list[1:3]</codeblock>",
                    "<codeblock>def get_first_three(list):\n    return list[:2]</codeblock>",
                    "<codeblock>def get_first_three(list):\n    return list[:3]</codeblock>",
                    "<codeblock>def get_first_three(list):\n    return list[0:2]</codeblock>"
                ],
                "correctAnswer": 2
            },
            ...
        ]
    }
}
`;


export const sampleUserInputCodingWithTrueFalseCodeblockAnswer = () => `
Sample User Input: "Can you generate a True or False coding quiz about Python basics?"

Expected LLM Output:

{
    "ai_response": {
        "message": "Generating a True or False coding quiz about Python basics."
    },
    "quiz_response": {
        "questions": [
            {
                "question": "In Python, <inlinecode>True</inlinecode> and <inlinecode>False</inlinecode> are examples of Booleans.",
                "type": "true-false",
                "choices": ["True", "False"],
                "correctAnswer": 0
            },
            {
                "question": "The following Python code will produce a syntax error:\n\n<codeblock>print('Hello'\n</codeblock>",
                "type": "true-false",
                "choices": ["True", "False"],
                "correctAnswer": 0
            },
            {
                "question": "In Python, the code <inlinecode>5 == '5'</inlinecode> will return <inlinecode>True</inlinecode>.",
                "type": "true-false",
                "choices": ["True", "False"],
                "correctAnswer": 1
            },
            {
                "question": "Python lists are ordered, changeable, and allow duplicate values.",
                "type": "true-false",
                "choices": ["True", "False"],
                "correctAnswer": 0
            },
            ...
        ]
    }
}
`;
