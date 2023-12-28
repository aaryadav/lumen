import OpenAI from 'openai';

import https from 'https'
import qs from 'qs';

const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    apiKey: process.env.OPENAI_API_KEY,
});

const SUBSCRIPTION_KEY = process.env.AZURE_SUBSCRIPTION_KEY;

if (!SUBSCRIPTION_KEY) {
    throw new Error('Missing the AZURE_SUBSCRIPTION_KEY environment variable');
}

interface BingSearchResult {
    title: string;
    url: string;
    snippet: string;
}

const bingWebSearch = async (query: string, answerCount: number, count: number): Promise<BingSearchResult[]> => {
    return new Promise((resolve, reject) => {
        let params = {
            q: encodeURIComponent(query),
            count: encodeURIComponent(count),
            answerCount: encodeURIComponent(answerCount),
            responseFilter: encodeURIComponent('Webpages'),
        };

        let queryString = qs.stringify(params);
        https.get({
            hostname: 'api.bing.microsoft.com',
            path: '/v7.0/search?q=' + queryString,
            headers: { 'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY },
        }, res => {
            let body = ''
            res.on('data', part => body += part)
            res.on('end', () => {
                let jsonResponse = JSON.parse(body);
                let searchResults: BingSearchResult[] = jsonResponse['webPages']['value'].map((info: any) => ({
                    title: info['name'],
                    url: info['url'],
                    snippet: info['snippet']
                }));

                resolve(searchResults);
            })
            res.on('error', e => {
                console.log('Error: ' + e.message)
                throw e
            })
        })
    });
}

export async function POST(req: Request): Promise<Response> {
    const { messages } = await req.json();

    const systemPrompt = `
    Generate 1 short-medium length search engine query for the following user message: ${messages}
    Just output the user message without modification if it is short and of the type a search engine would understand.
    `
    const allMessages = [
        { "role": "system", "content": systemPrompt },
        ...messages
    ];

    const response = await openai.chat.completions.create({
        model: 'mistralai/mixtral-8x7b-instruct',
        stream: true,
        messages: allMessages,
    });

    let searchQuery = '';
    for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
            searchQuery += content;
        }
    }

    if (!searchQuery) {
        throw new Error('Search query is empty or invalid');
    }

    const answerCount = 1;
    const count = 5;
    const searchResults = await bingWebSearch(searchQuery, answerCount, count);

    return Response.json({ searchResults })
}