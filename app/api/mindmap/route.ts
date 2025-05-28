import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY,
});

// Enhanced validation for Mermaid mindmap code
function validateMermaidCode(code: string): { isValid: boolean; error?: string } {
  if (!code.trim()) {
    return { isValid: false, error: "Generated code is empty" };
  }

  // Check if code starts with 'mindmap'
  if (!code.trim().startsWith("mindmap")) {
    return { isValid: false, error: "Code must start with 'mindmap'" };
  }

  // Define valid shape patterns
  const validShapes = [
    /([A-Za-z0-9_]+)\[.*?\]/, // Square: ID[Label]
    /([A-Za-z0-9_]+)\(.*?\)/, // Rounded square: ID(Label)
    /([A-Za-z0-9_]+)\(\(.*?\)\)/, // Circle: ID((Label))
    /([A-Za-z0-9_]+)\)\).*?\(\(/, // Bang: ID))Label((
    /([A-Za-z0-9_]+)\).*?\(/, // Cloud: ID)Label(
    /([A-Za-z0-9_]+)\{\{.*?\}\}/, // Hexagon: ID{{Label}}
    /^[A-Za-z0-9\s\-.,!&()':;]+$/ // Default: plain text (allows spaces, hyphens, punctuation, colons, semicolons)
  ];

  // Check for invalid node syntax
  const lines = code.split("\n").filter(line => line.trim());
  for (const line of lines) {
    const trimmedLine = line.trim();
    // Skip lines with icons or classes
    if (trimmedLine.startsWith("::icon") || trimmedLine.startsWith(":::")) {
      continue;
    }
    // Skip the 'mindmap' line
    if (trimmedLine === "mindmap") {
      continue;
    }
    // Check if the line is a node
    const hasValidShape = validShapes.some(pattern => pattern.test(trimmedLine));
    const isPlainText = /^[A-Za-z0-9\s\-.,!&()':;]+$/.test(trimmedLine);
    if (!hasValidShape && !isPlainText) {
      return { isValid: false, error: `Invalid node syntax in line: ${trimmedLine}. Use plain text (e.g., Origins, Binary Cross-Entropy, Two main components: Generator and Discriminator), ID[Label] for squares, ID((Label)) for circles, etc.` };
    }
  }

  // Check for valid node IDs (for shaped nodes)
  const nodeIds = code.match(/[A-Za-z0-9_]+(?=[\[\(\)\{])/g) || [];
  for (const id of nodeIds) {
    if (!/^[A-Za-z0-9_]+$/.test(id)) {
      return { isValid: false, error: `Invalid node ID '${id}'. IDs for shaped nodes must be alphanumeric with underscores` };
    }
  }

  // Check for consistent indentation
  let prevIndent = 0;
  for (let i = 1; i < lines.length; i++) {
    const currentIndent = lines[i].search(/\S|$/);
    if (currentIndent > prevIndent + 4 || currentIndent < prevIndent - 4) {
      if (currentIndent !== prevIndent && currentIndent !== prevIndent + 2 && currentIndent !== prevIndent + 4) {
        return { isValid: false, error: `Inconsistent indentation at line ${i + 1}` };
      }
    }
    prevIndent = currentIndent;
  }

  // Check for valid icon syntax
  const iconLines = code.match(/::icon\(.+?\)/g) || [];
  for (const icon of iconLines) {
    if (!icon.includes("fa ") && !icon.includes("mdi ")) {
      return { isValid: false, error: "Icons must use 'fa' or 'mdi' classes (e.g., ::icon(fa fa-book))" };
    }
  }

  // Check for markdown strings (basic check for <br/>, **, *)
  const markdownLines = code.match(/\[.*?(?:\*\*.*?\*\*|.*?\*.*?\*|.*?<br\/>.*?)\]/g) || [];
  for (const line of markdownLines) {
    if (!line.match(/\[.*?\]/)) {
      return { isValid: false, error: `Invalid markdown syntax in line: ${line}. Markdown must be within valid shape delimiters` };
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
          content: `You are an expert Mermaid mindmap generator. Create valid, well-structured Mermaid mindmaps that render correctly in Mermaid 10.x. Follow these strict rules:
          - Start with 'mindmap' on the first line.
          - Use consistent indentation (2 or 4 spaces) to define hierarchy levels.
          - Define nodes using:
            - Plain text: Descriptive text (e.g., Origins, Binary Cross-Entropy, Two main components: Generator and Discriminator) for default nodes, allowing spaces, hyphens, colons, and common punctuation.
            - Square: ID[Label] (e.g., Node1[Square Node]).
            - Rounded square: ID(Label) (e.g., Node1(Rounded Node)).
            - Circle: ID((Label)) (e.g., Node1((Circle Node))).
            - Bang: ID))Label(( (e.g., Node1))Bang Node(( ).
            - Cloud: ID)Label( (e.g., Node1)Cloud Node( ).
            - Hexagon: ID{{Label}} (e.g., Node1{{Hexagon Node}}).
          - **Never** use ID(Label) for non-rounded-square nodes or other invalid formats.
          - Use unique, alphanumeric IDs with underscores for nodes with shapes (e.g., A1, Node_1). Plain text nodes can use descriptive names with spaces, hyphens, colons, or punctuation (e.g., Two main components: Generator and Discriminator).
          - Support markdown strings in labels (e.g., "**Bold**", "*Italic*", "<br/>") for formatting and line breaks.
          - Add icons using ::icon(fa fa-<icon>) or ::icon(mdi mdi-<icon>) (e.g., ::icon(fa fa-book)) on a new line after the node.
          - Add classes using :::#color class (e.g., :::#8b5cf6 large) on a new line after the node.
          - Use vibrant colors in classes: #00b894 (green), #0984e3 (blue), #8b5cf6 (purple), #f59e0b (amber), #ef4444 (red), #06b6d4 (cyan).
          - Ensure all nodes are hierarchically connected with a single root node, preferably using a circle shape (e.g., root((Mindmap))).
          - Return only the Mermaid code, without markdown fences (e.g., \`\`\`mermaid), explanations, or comments.
          - Ensure no syntax errors, especially avoiding invalid node formats.

          Example for a mindmap (based on a machine learning system):
          mindmap
            root((Machine Learning))
              Concepts
                Supervised Learning
                ::icon(fa fa-book)
                Unsupervised Learning
                  Clustering
                  Dimensionality Reduction
              Applications
                Image Recognition
                ::icon(mdi mdi-image)
                :::#0984e3
                Natural Language Processing
                  Sentiment Analysis
                  Chatbots: Text-based
              Challenges
                Overfitting
                ::icon(fa fa-exclamation-triangle)
                :::#ef4444
                Data Quality
                  Missing Data
                  Noisy Data

          Create a mindmap for the requested prompt, adhering strictly to these rules.`
        },
        {
          role: "user",
          content: `Create a detailed Mermaid mindmap for: ${prompt}`,
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