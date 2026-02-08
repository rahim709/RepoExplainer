// Gemini API wrappers
import config from '../config/config.js';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: config.geminiAPI });

const summarySystemInstruction = `
You are an expert Senior Software Architect and Code Auditor. 
Your goal is to analyze a GitHub repository based on its File Tree and Key File Contents (README, Manifests).

You must generate a structured analysis in JSON format.
Focus on:
1. Identifying the core purpose of the project.
2. Extracting the Tech Stack (Languages, Frameworks, Tools).
3. Inferring the Architecture (e.g., "MVC", "Microservices", "ROS Nodes") based on folder structure.
4. listing key features.

Output strictly valid JSON. Do not include markdown code blocks.
`;

export async function getSummary(content: string) {
  const modelId = 'gemini-3-flash-preview'; // or 'gemini-1.5-flash' (Use a stable model)

  // We add the schema requirement directly to the user prompt for strict adherence
  const dynamicPrompt = `
    Analyze the following repository context:
    ${content}

    Return the result in this specific JSON schema:
    {
      "projectName": "String",
      "summary": "String (4 sentences max)",
      "techStack": ["String", "String"],
      "keyFeatures": ["String", "String", "String"],
      "architecture": {
        "style": "String (e.g., Monolithic, Event-Driven)",
        "explanation": "String (How the modules interact)"
      },
      "complexity": "String (Low/Medium/High)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      config: {
        systemInstruction: summarySystemInstruction,
        responseMimeType: 'application/json', // <--- THE MAGIC LINE (Forces JSON)
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: dynamicPrompt }],
        },
      ],
    });

    const rawText = response.text;
    if (!rawText) return null;
    console.log('Raw AI Response:', rawText); // Debugging: See what it actually returned

    // --- FIX STARTS HERE ---
    // 1. Clean up markdown code blocks if present (```json ... ```)
    const cleanText = rawText.replace(/```json|```/g, '').trim();

    // 2. Find the start and end of the actual JSON object
    const startIndex = cleanText.indexOf('{');
    const endIndex = cleanText.lastIndexOf('}');

    if (startIndex === -1 || endIndex === -1) {
      throw new Error('No JSON found in response');
    }

    const jsonString = cleanText.substring(startIndex, endIndex + 1);

    const jsonResponse = JSON.parse(jsonString);

    return jsonResponse;
  } catch (error) {
    console.error('Gemini Error:', error);
    return null;
  }
}

export async function identifyRelevantFiles(
  userQuery: string,
  fileTree: string[],
  maxFiles = 4,
) {
  const modelId = 'gemini-3-flash-preview';
  const systemInstruction = `
    You are an intelligent file retrieval agent.
    
    TASK:
    Analyze the USER QUERY and the provided FILE LIST.
    Select up to ${maxFiles} file paths that are absolutely necessary to answer the query.

    RULES:
    1. STRICTLY JSON OUTPUT: Return ONLY a valid JSON object. No Markdown. No explanations.
    2. EXISTENCE CHECK: You must ONLY select paths that exist in the provided file list.
    3. CASUAL TALK: If the query is conversational (e.g., "Hi", "Hello", "Thanks") or general (e.g., "Explain this project"), return "files": [].
    4. FALLBACK: If no specific file is relevant, return "files": [].

    SCHEMA:
    { "files": ["path/to/file1", "path/to/file2"] }
  `;

  const prompt = `
    Project Structure:
    ${fileTree.join('\n')}

    User Query: "${userQuery}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: systemInstruction,
      },
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    const text = response.text;
    if (!text) return [];
    const cleanText = text.replace(/```json|```/g, '').trim();
    const json = JSON.parse(cleanText);

    return json.files || [];
  } catch (error) {
    console.error('AI File Selection Failed:', error);
    return []; // Return empty if it fails so app doesn't crash
  }
}

// You also need the final answer function
export async function generateChatResponse(
  context: string,
  query: string,
  history: any[],
) {
  const modelId = 'gemini-3-flash-preview';
  const systemInstruction = `
    You are an expert AI Coding Assistant specialized in explaining codebases.

    BEHAVIOR RULES:
    1. TECHNICAL QUERIES: If the user asks about code, logic, or errors, provide a detailed, comprehensive answer using the provided context.
    2. CASUAL CONVERSATION: If the user says "Hi", "Hello", "How are you", or "Thanks", BE CONCISE. Just say "Hello! Ready to help with your code." or similar. Do NOT explain your capabilities unless asked.
    3. UNKNOWN CONTEXT: If the context is empty and the user asks a code question, admit you don't see that specific file and ask them to be specific.
    4. TONE: Professional, encouraging, and direct.
  `;

  // 2. HISTORY PREP
  const geminiHistory = history.slice(-3).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  // 3. PROMPT CONSTRUCTION
  let finalPrompt = '';

  if (context && context.trim().length > 0) {
    finalPrompt = `
      Context from relevant files:
      ${context}

      User Question: ${query}

      Answer the user comprehensively based on the code provided.
    `;
  } else {
    finalPrompt = query;
  }

  const currentMessage = {
    role: 'user',
    parts: [{ text: finalPrompt }],
  };

  const fullConversation = [...geminiHistory, currentMessage];

  // 4. SEND WITH CONFIG
  const response = await ai.models.generateContent({
    model: modelId,
    config: {
      systemInstruction: systemInstruction, // <--- Attach the rules here
      temperature: 0.7, // 0.7 is good for creative but grounded answers
    },
    contents: fullConversation,
  });

  // Note: Standard Google SDK usually returns a function .text()
  return response.text;
}
