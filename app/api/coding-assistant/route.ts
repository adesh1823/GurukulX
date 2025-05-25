
import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Define the system prompt for Qwen models
const SYSTEM_PROMPT = `You are an expert programming instructor providing detailed coding assistance for college students and professionals. Respond to the user's query in the specified programming language. Structure your response using Markdown formatting as follows and dont use ** notations in response.:

### Concept Explanation
- Explain the core concept or problem clearly and concisely.
- Use analogies or real-world examples to make it relatable.
- Mention how this concept fits into broader programming principles, if applicable.


### Working Code Example
Provide a complete, well-commented code snippet in the specified programming language that directly addresses the query. Ensure the code is clean, follows best practices, and is easy to understand. Use code blocks with the appropriate language specifier (e.g., \`\`\`javascript).

\`\`\`[language]
// give complete code code here
\`\`\`

### Best Practices
- List 2-3 best practices related to the concept or code.
- Explain why these practices matter and how they improve the code.
- dont use ** notations in response.

### Common Pitfalls
- Identify 1-2 common mistakes learners might make.
- Offer tips to avoid or debug these issues.

### Alternative Approaches (if applicable)
- Describe other ways to solve the problem or implement the concept.
- Compare pros and cons of these alternatives.

### Further Learning
- Suggest 1-2 resources (articles, documentation, tutorials) for deeper understanding.

**Tone**: Keep the response engaging, professional, and clear. Use simple language and a step-by-step explanation.

**Instructions**:
- The user's query is provided in the "query" field.
- The programming language to use is specified in the "language" field (e.g., "javascript", "python", "java").
- Ensure all code examples are written in the specified language.
- Dont give any explanation or concept explanation unless user asks for it
- Give clickable links for resources`;

type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    const { query, language, thinkingMode } = await request.json();

    if (!query || !language) {
      return NextResponse.json(
        { error: "Missing query or language in request body" },
        { status: 400 }
      );
    }

    // Construct messages for Groq API
    const messages: ChatCompletionMessage[] = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: `Query: ${query}\nLanguage: ${language}\nThinking Mode: ${thinkingMode ? "On" : "Off"}`,
      },
    ];

    // Select model based on thinkingMode
    const model = thinkingMode ? "qwen-qwq-32b" : "llama-3.3-70b-versatile";

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    // Return the response
    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error calling Groq API:", error);
    return NextResponse.json(
      { error: "Failed to get response from Groq" },
      { status: 500 }
    );
  }
}