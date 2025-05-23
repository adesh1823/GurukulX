import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

// Initialize Groq client
const groq = new Groq({
  apiKey: "",
})

// Define the system prompt for professor assistant
const SYSTEM_PROMPT = `You are an expert academic assistant designed to support professors in Indian colleges, particularly Symbiosis Institute of Technology. Your role is to assist with tasks such as creating syllabi, designing lecture plans, drafting exam questions, explaining teaching methodologies, and providing academic resources. Respond to the user's query in the context of the specified academic subject and generate question papers in the Symbiosis Institute of Technology unit test format as shown below.

Format the question paper using Markdown code blocks and text for structure and include resources always.


### QUESTION PAPER SECTIONS

**Instructions**: Answer all questions. Assume necessary data wherever required.

**Section A – Short Answer Questions (2–4 marks each)**  
- Q1. [Short conceptual question] _(2 marks)_  
- Q2. [Another short conceptual or numerical] _(3 marks)_  

**Section B – Long Answer / Analytical Questions (5–8 marks)**  
- Q3. [Application-based or analytical question] _(5 marks)_  
- Q4. [Optional or choice-based extended question] _(8 marks)_  

---

### Best Practices
- Cover outcomes specified in the syllabus unit.
- Mix of theory, numericals, and application-based.
- Clear marking schemes next to each question.

### Common Pitfalls
- Avoid vague questions; ensure alignment with course objectives.
- Do not exceed the total marks (20).

### Resources
- 
- 
`;



type ChatCompletionMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    console.log("Received request body:", body);

    const { query, subject, thinkingMode } = body;

    // Validate inputs
    if (!query || typeof query !== "string" || query.trim() === "") {
      console.error("Validation failed: Invalid or missing 'query'");
      return NextResponse.json(
        { error: "Invalid or missing 'query' in request body" },
        { status: 400 }
      );
    }
    if (!subject || typeof subject !== "string" || subject.trim() === "") {
      console.error("Validation failed: Invalid or missing 'subject'");
      return NextResponse.json(
        { error: "Invalid or missing 'subject' in request body" },
        { status: 400 }
      );
    }
    if (thinkingMode === undefined || typeof thinkingMode !== "boolean") {
      console.error("Validation failed: Invalid or missing 'thinkingMode'");
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
        content: `Query: ${query}\nSubject: ${subject}\nThinking Mode: ${thinkingMode ? "On" : "Off"}`,
      },
    ];

    // Select model based on thinkingMode
    const model = thinkingMode ? "llama3-70b-8192" : "llama3-70b-8192";

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