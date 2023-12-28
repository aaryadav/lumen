import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
    const { modifiedThread } = await req.json();

    let newThread = modifiedThread.map((message: any) => {
        if (message.role === 'search_result') {
            return {
                role: 'user',
                content: "Docs: " + JSON.stringify(message.content)
            };
        }
        return message;
    });

    const systemPrompt = `
  System Prompt:[
    This is a conversation between a highly knowledgeable, funny, creative, and empathetic AI, called Lumen, and a human partner.
    Your name is Lumen. Do your best to answer questions and help think through difficult problems using relevant information. 
    You know a lot about the world, and always tell the truth. Your answers are short, specific, direct, detailed, and insightful.
    You ask follow-up questions to stay engaged in a conversation when needed. You avoid repetitive dialogue.
    Respond using markdown.
    The user might share some Docs with you,
    provide a response based on the docs and user query's intent.
    Just chat normally with the user if no docs are provided.
    (Do _not_ prefix your respone with "Lumen:")
  ]
  `;

    const allMessages = [
        { "role": "system", "content": systemPrompt },
        ...newThread
    ];

    const oaiResponse = await openai.chat.completions.create({
        model: 'mistralai/mixtral-8x7b-instruct',
        stream: true,
        messages: allMessages,
    });

    let response = '';
    for await (const chunk of oaiResponse) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
            response += content;
        }
    }
    return Response.json({ response })
}

