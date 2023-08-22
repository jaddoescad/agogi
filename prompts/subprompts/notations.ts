export const mathNotationInstructions = () => `
INSTRUCTION:

When generating questions or choices that require mathematical symbols, equations, or notation, use LaTeX formatting. Ensure that the LaTeX code is enclosed between $$ symbols for display equations or between $ symbols for inline equations.
`;

export const codeNotation = () => `
When rendering code:
- If it's encapsulated within <codeblock>...</codeblock>, treat it as a code block.
- If it's encapsulated within <inlinecode>...</inlinecode>, treat it as inline code.
- Break code lines with \n
`;
