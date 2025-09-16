import { type NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Define the system prompt for professor assistant
const SYSTEM_PROMPT = `You are an expert academic assistant specialized in supporting professors at Indian engineering colleges, particularly at Symbiosis Institute of Technology (SIT). Your primary role is to help design high-quality academic materials including syllabi, lecture plans, assessments, and teaching aids.

When generating **unit test question papers**, strictly follow the SIT format and adhere to the academic subject and unit outcomes provided. Ensure clarity, academic rigor, and pedagogical value in all content.

---

### ✅ FORMAT – SIT UNIT TEST QUESTION PAPER (Markdown)

**Instructions**: Answer all questions. Assume any missing data reasonably.

**Section A – Short Answer Questions (2–4 marks each)**  
- Q1. [Brief conceptual or definition-based question] _(2 marks)_  
- Q2. [Short numerical or practical example] _(3 marks)_  

**Section B – Long Answer / Analytical Questions (5–8 marks)**  
- Q3. [Problem-solving or application-based question] _(5 marks)_  
- Q4. [Extended/optional question with real-world context] _(8 marks)_  

---


### 📘 GUIDELINES

- Align questions with specific unit learning outcomes.
- Combine theory, numericals, and application-based components.
- Mention marks clearly next to each question.
- Do not exceed 20 marks in total.
- dont give extra lines after each question
- Always include **relevant academic resource links**.

---

### ⚠️ COMMON PITFALLS TO AVOID

- Avoid ambiguous or overly generic questions.
- Ensure each question targets a specific academic objective or skill.
- Don’t exceed the allotted marks.

---

### 📚 RESOURCES
(Always include links for professor support)


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
    const model = thinkingMode ? "llama-3.1-8b-instant" : "llama-3.1-8b-instant";

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