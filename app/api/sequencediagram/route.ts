import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY,
});

// Validation for Mermaid sequence diagram code
function validateSequenceDiagram(code: string): { isValid: boolean; error?: string } {
  if (!code.trim()) {
    return { isValid: false, error: "Generated code is empty" };
  }

  if (!code.trim().startsWith("sequenceDiagram")) {
    return { isValid: false, error: "Code must start with 'sequenceDiagram'" };
  }

  // Check for at least one participant
  if (!code.includes("participant")) {
    return { isValid: false, error: "No participants defined" };
  }

  // Check for at least one message (looking for arrow syntax)
  const arrowRegex = /->>|-->>|-\)|--\)/;
  if (!arrowRegex.test(code)) {
    return { isValid: false, error: "No messages defined" };
  }

  return { isValid: true };
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an expert Mermaid sequence diagram generator. Create valid, well-structured Mermaid sequence diagrams that render correctly in Mermaid 10.x. Follow these strict rules:
- Start with 'sequenceDiagram' on the first line.
- Define participants explicitly using 'participant ID as Name' for clarity (e.g., participant U as User).
- Use appropriate arrow types for messages:
  - '->>' for solid line with arrowhead (asynchronous)
  - '-->>' for dashed line with arrowhead (asynchronous)
  - '-)' for solid line with open arrowhead (synchronous)
  - '--)' for dashed line with open arrowhead (synchronous)
- Use 'activate' and 'deactivate' to show lifelines (e.g., activate Participant).
- Support notes with 'Note [right of|left of|over] Participant: text'.
- Use control flow structures like 'alt', 'opt', 'loop', 'par' where appropriate.
- Ensure all participants are defined before use.
- Use unique, alphanumeric IDs for participants (e.g., A1, User1).
- Return only the Mermaid code, without markdown fences or explanations.
- Ensure no syntax errors.

Example:
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    activate B
    B-->>A: Great!
    deactivate B
    A-)B: See you later!`
        },
        {
          role: "user",
          content: `Create a detailed Mermaid sequence diagram for: ${prompt}`,
        },
      ],
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      temperature: 0.5,
      max_tokens: 2000,
      top_p: 1,
      stop: null,
      stream: false,
    });

    const diagram = chatCompletion.choices[0]?.message?.content || "";
    console.log("Generated Mermaid code:", diagram); // Debugging log

    const validation = validateSequenceDiagram(diagram);
    if (!validation.isValid) {
      console.error("Invalid Mermaid code generated:", validation.error);
      return NextResponse.json(
        { error: `Generated diagram contains invalid Mermaid syntax: ${validation.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ diagram });
  } catch (error) {
    console.error("Error generating diagram:", error);
    return NextResponse.json(
      { error: "Failed to generate sequence diagram" },
      { status: 500 }
    );
  }
}