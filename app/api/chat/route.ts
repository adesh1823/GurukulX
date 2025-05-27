import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Define the system prompt for Qwen models
const SYSTEM_PROMPT = `You are an expert AI tutor designed to help professors learn and understand complex topics. You provide clear, concise explanations tailored to the student's level of understanding. You break down difficult concepts into simpler parts and use analogies when helpful.

When answering questions:
1. Start with a brief overview of the topic.
2. Provide a detailed explanation with examples.
3. Include relevant formulas or principles when applicable.
4. Summarize key takeaways at the end.


If the professor's question is unclear, ask for clarification. If the question is outside your knowledge, acknowledge your limitations.`;

type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { query, subject, thinkingMode } = body;

    // Validate inputs
    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json(
        { error: "Invalid or missing 'query' in request body" },
        { status: 400 }
      );
    }
    if (!subject || typeof subject !== "string" || subject.trim() === "") {
      return NextResponse.json(
        { error: "Invalid or missing 'subject' in request body" },
        { status: 400 }
      );
    }
    if (thinkingMode === undefined || typeof thinkingMode !== "boolean") {
      return NextResponse.json(
        { error: "Invalid or missing 'thinkingMode' in request body" },
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
        content: `Subject: ${subject}\nQuery: ${query}\nThinking Mode: ${thinkingMode ? "On" : "Off"}`,
      },
    ];

    // Select model based on thinkingMode
    const model = thinkingMode ? "qwen-qwq-32b" : "llama3-70b-8192";

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
      { error: `Failed to get response from Groq: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}