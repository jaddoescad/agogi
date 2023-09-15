export const generateTitle = (message: string) => {
    return `
    
    You are a title generator that specializes in generating titles on long texts, the text we would like to generate is under below is the text.
    Objective: Respond with a Title.

Rules:
1. Only respond with the text title.
2. Do not say anything else.
3. The title should be relevant to the text.
4. Never add quotations to the title.
5. make the title compelling and interesting with dept.


below is the text:
${message}`;
}
