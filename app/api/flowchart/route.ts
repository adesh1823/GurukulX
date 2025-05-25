import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ 
  apiKey:process.env.GROQ_API_KEY,
});

// Enhanced validation for Mermaid code
function validateMermaidCode(code: string): { isValid: boolean; error?: string } {
  if (!code.trim()) {
    return { isValid: false, error: "Generated code is empty" };
  }

  // Check if code starts with 'flowchart'
  if (!code.trim().startsWith("flowchart")) {
    return { isValid: false, error: "Code must start with 'flowchart TD' or 'flowchart LR', not 'graph' or other keywords" };
  }

  // Check for invalid node syntax (e.g., ID(Label) instead of ID[Label] or ID{Label})
  const invalidNodePattern = /[A-Za-z0-9_]+\([^)]+\)/g;
  if (invalidNodePattern.test(code)) {
    return { isValid: false, error: "Invalid node syntax detected (e.g., ID(Label)). Use ID[Label] for rectangles or ID{Label} for diamonds" };
  }

  // Check for unclosed subgraphs
  const subgraphOpen = (code.match(/subgraph\s/g) || []).length;
  const subgraphClose = (code.match(/end/g) || []).length;
  if (subgraphOpen !== subgraphClose) {
    return { isValid: false, error: "Mismatched subgraph 'end' statements" };
  }

  // Check for invalid style statements
  const styleStatements = code.match(/style\s+\w+\s+[^;\n]+/g) || [];
  for (const style of styleStatements) {
    if (!style.includes("fill:") || !style.includes("stroke:")) {
      return { isValid: false, error: "Style statements must include fill and stroke properties (e.g., style ID fill:#color,stroke:#color)" };
    }
  }

  // Check for invalid node IDs (must be alphanumeric with underscores)
  const nodeIds = code.match(/[A-Za-z0-9_]+(?=\[|\{)/g) || [];
  for (const id of nodeIds) {
    if (!/^[A-Za-z0-9_]+$/.test(id)) {
      return { isValid: false, error: `Invalid node ID '${id}'. IDs must be alphanumeric with underscores` };
    }
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
          content: `You are an expert Mermaid diagram generator. Create valid, well-structured Mermaid flowcharts that render correctly in Mermaid 10.x. Follow these strict rules:
          - Always start with 'flowchart TD' (top-down) or 'flowchart LR' (left-right) based on the prompt's context; never use 'graph' or other diagram types.
          - Define nodes using:
            - ID["Label"] for rectangular nodes.
            - ID{"Label"} for diamond-shaped decision nodes.
            - Never use ID(Label), ID(Label), or other formats.
          - Use unique, alphanumeric IDs with underscores (e.g., A1, Node_1).
          - Use --> for solid arrows, -.-> for dotted arrows.
          - Use subgraphs to group related nodes when appropriate, ensuring each subgraph has a matching 'end'.
          - Apply styles using inline 'style ID fill:#color,stroke:#color,stroke-width:2px' statements after all nodes are defined.
          - Use vibrant colors: #00b894 (green), #0984e3 (blue), #8b5cf6 (purple), #f59e0b (amber), #ef4444 (red), #06b6d4 (cyan).
          - Add emojis to node labels for visual appeal, relevant to the node’s purpose.
          - Avoid classDef; use inline styles for simplicity.
          - Return only the Mermaid code, without markdown fences (e.g., \`\`\`mermaid), explanations, or comments.
          - Ensure the diagram is complete, with all nodes connected and no syntax errors.

          Example for a healthcare chatbot (ArogyaBot):
          flowchart TD
              A["User Opens ArogyaBot 1.0"] --> B{"Select Interaction Mode"}
              B --> C1["Thinking Mode - Clarvis-3B Medical Reasoning"] & C2["Vision Assistance - Clarvis-3B Vision Model"] & C3["Normal Chat Mode - Daily Health Queries"]
              C1 --> D1["User Describes Symptoms via Voice or Text"]
              D1 --> E1["Clarvis-3B Medical Reasoning Analyzes and Provides Response"]
              E1 --> F1{"Further Action Needed?"}
              F1 -- Yes --> G1["Suggest Appointment or Emergency Escalation"]
              F1 -- No --> H1["Provide Care Advice and End Session"]
              C2 --> D2["User Uploads or Captures Image"]
              D2 --> E2["Clarvis-3B Vision Analyzes Wound or Condition"]
              E2 --> F2{"Severity Detected?"}
              F2 -- Critical --> G2["Auto-Alert Healthcare Provider"]
              F2 -- Minor --> H2["Provide First-Aid Instructions"]
              C3 --> D3["User Asks General Health Questions"]
              D3 --> E3["Gemma2-9b-it Responds with Multilingual, Empathetic Answers"]
              E3 --> F3{"Need Further Help?"}
              F3 -- Yes --> G3["Connect to Specialist or Provide Resources"]
              F3 -- No --> H3["End Session with Health Tips"]
              style A fill:#00b894,stroke:#000,stroke-width:2px
              style B fill:#0984e3,stroke:#000,stroke-width:2px

          Create a flowchart for the requested prompt, adhering strictly to these rules.`
        },
        {
          role: "user",
          content: `Create a detailed Mermaid flowchart for: ${prompt}`,
        },
      ],
      model: "meta-llama/llama-4-maverick-17b-128e-instruct",
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 1,
      stop: null,
      stream: false,
    });

    const diagram = chatCompletion.choices[0]?.message?.content || "";

    // Validate the generated Mermaid code
    const validation = validateMermaidCode(diagram);
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
      { error: "Failed to generate diagram" },
      { status: 500 }
    );
  }
}