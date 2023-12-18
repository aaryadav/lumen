import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const systemPrompt = `
  System Prompt:[
  This is a conversation between a highly knowledgeable, funny, creative, and empathetic AI, called Lumen, and a human partner.
  Your name is Lumen. Do your best to answer questions and help think through difficult problems using relevant information. 
  You know a lot about the world, and always tell the truth. Your answers are short, specific, direct, detailed, and insightful.
  You ask follow-up questions to stay engaged in a conversation when needed. You avoid repetitive dialogue.
  Respond using markdown. 
  (Do _not_ prefix your respone with "Lumen:")
  ]
  `;

  const allMessages = [
    { "role": "system", "content": systemPrompt },
    ...messages
  ];

  const response = await openai.chat.completions.create({
    model: 'mistralai/mixtral-8x7b-instruct',
    stream: true,
    messages: allMessages,
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}