import { GoogleGenAI } from '@google/genai';

export async function onRequest(context) {
  try {
    const { request, env } = context;
    const url = new URL(request.url);
    const difficulty = url.searchParams.get('difficulty') || 'easy';

    if (!env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'Missing GEMINI_API_KEY' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const systemPrompt = `You are generating a batch of 5 multiple-choice quiz questions about space weather for kids/teens.
Return STRICT JSON only. Do NOT include markdown formatting.
Each question must have:
 - id: string (unique within the batch)
 - question: string
 - options: array of 4 short strings
 - correctIndex: integer between 0-3
 - explanation: string (one concise sentence)

Difficulty levels:
 - easy: basic facts and definitions
 - medium: cause/effect and relationships
 - hard: reasoning, comparisons, or scenarios

Topic scope: solar wind, solar flares, CMEs, auroras, magnetosphere, historical events (e.g., Carrington), impacts on tech (satellites, power grids, GPS), safety/resilience.

Output schema: { questions: Question[] }`;

    const userPrompt = `Create 5 ${difficulty} questions. Ensure options are plausible, unique, and only one is correct. Keep wording friendly and concise.`;

    // Use official SDK
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const requestedModel = new URL(request.url).searchParams.get('model') || 'gemini-2.5-flash';
    const fallbackModel = 'gemini-1.5-flash';
    const temperature = difficulty === 'easy' ? 0.4 : difficulty === 'medium' ? 0.6 : 0.8;

    const makePromptString = () => `${systemPrompt}\n\n${userPrompt}\nRespond with JSON only.`;

    let text = '';
    let modelUsed = requestedModel;
    try {
      const response = await ai.models.generateContent({
        model: requestedModel,
        contents: makePromptString(),
        generationConfig: { temperature, maxOutputTokens: 1024 },
      });
      text = response.text;
    } catch (primaryErr) {
      // Try fallback model for resilience
      try {
        const response = await ai.models.generateContent({
          model: fallbackModel,
          contents: makePromptString(),
          generationConfig: { temperature, maxOutputTokens: 1024 },
        });
        text = response.text;
        modelUsed = fallbackModel;
      } catch (fallbackErr) {
        console.error('Gemini error', { primary: String(primaryErr), fallback: String(fallbackErr) });
        return new Response(
          JSON.stringify({ error: 'Gemini request failed', details: String(primaryErr), fallbackError: String(fallbackErr) }),
          { status: 502, headers: { 'content-type': 'application/json' } }
        );
      }
    }

    // Attempt to parse JSON from the model response
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Fallback: try to extract JSON block if model added any stray text
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      }
    }

    if (!parsed || !Array.isArray(parsed.questions)) {
      return new Response(
        JSON.stringify({ error: 'Invalid model response', raw: text }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }
    

    // Normalize fields and coerce into expected shape
    const questions = parsed.questions
      .slice(0, 5)
      .map((q, i) => ({
        id: String(q.id ?? i + 1),
        question: String(q.question ?? ''),
        options: Array.isArray(q.options) ? q.options.slice(0, 4).map(String) : [],
        correctIndex: Number.isInteger(q.correctIndex) ? q.correctIndex : 0,
        explanation: String(q.explanation ?? ''),
      }))
      .filter((q) => q.question && q.options.length === 4);

    return new Response(JSON.stringify({ questions, modelUsed }), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unexpected error', message: String(err) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}


