import { NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq client with API key from environment variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    const { subject, topic, gradeLevel, difficultyLevel, questionTypes, numberOfQuestions } = body;

    // Validate input
    if (!subject || !topic || !gradeLevel || !difficultyLevel || !questionTypes || !numberOfQuestions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Construct the prompt for Groq
    const prompt = `
      Generate a worksheet for the subject "${subject}" on the topic "${topic}" for ${gradeLevel.replace("_", " ")} students with a ${difficultyLevel} difficulty level. Include ${numberOfQuestions} questions of the following types: ${questionTypes.join(", ")}.
      Format the worksheet in markdown with clear sections for each question type and include an answer key at the end. Ensure the content is accurate, educational, and tailored to the specified grade level and difficulty.
      give the matching in proper foramt dont use | in it and columns should come side by side proper formatting with proper spaces between columns.
      give questions in bold so that it is easy to read.

    `;

    // Make the API call to Groq
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert educational assistant that generates high-quality, accurate worksheets for students. Provide detailed and well-structured content in markdown format.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-70b-8192",
      temperature: 0.5,
      max_tokens: 2048,
      top_p: 1,
      stop: null,
      stream: false,
    });

    const worksheet = chatCompletion.choices[0]?.message?.content || "";

    // Return the generated worksheet
    return NextResponse.json({ worksheet }, { status: 200 });
  } catch (error) {
    console.error("Error generating worksheet:", error);
    return NextResponse.json({ error: "Failed to generate worksheet" }, { status: 500 });
  }
}