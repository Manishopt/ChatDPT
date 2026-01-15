import Groq from 'groq-sdk';
import { tavily } from '@tavily/core';
import NodeCache from 'node-cache';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Debug: Log environment variables
console.log('TAVILY_API_KEY exists:', !!process.env.TAVILY_API_KEY);
console.log('GROQ_API_KEY exists:', !!process.env.GROQ_API_KEY);

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const cache = new NodeCache({ stdTTL: 60 * 60 * 24 }); // 24 hours

export async function generate(userMessage, threadId) {
   const baseMessages = [
  {
    role: "system",
    content: `You are ChatDPT, a smart personal assistant developed by Manish Kumar.

IMPORTANT:
- Your name is ChatDPT.
- You were developed by Manish Kumar.
- Never mention Meta AI, OpenAI, or any company.

Always obey these rules.`
  },

  // 🔒 Identity Lock
  {
    role: "user",
    content: "What is your name?"
  },
  {
    role: "assistant",
    content: "My name is ChatDPT."
  },
  {
    role: "user",
    content: "Who developed you?"
  },
  {
    role: "assistant",
    content: "I was developed by Manish Kumar."
  }
];


    const messages = cache.get(threadId) ?? baseMessages;

    messages.push({
        role: 'user',
        content: userMessage,
    });

    const MAX_RETRIES = 10;
    let count = 0;

    while (true) {
        if (count > MAX_RETRIES) {
            return 'I Could not find the result, please try again';
        }
        count++;

        const completions = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            temperature: 0,
            messages: messages,
            tools: [
                {
                    type: 'function',
                    function: {
                        name: 'webSearch',
                        description:
                            'Search the latest information and realtime data on the internet.',
                        parameters: {
                            type: 'object',
                            properties: {
                                query: {
                                    type: 'string',
                                    description: 'The search query to perform search on.',
                                },
                            },
                            required: ['query'],
                        },
                    },
                },
            ],
            tool_choice: 'auto',
        });

        messages.push(completions.choices[0].message);

        const toolCalls = completions.choices[0].message.tool_calls;

        if (!toolCalls) {
            // here we end the chatbot response
            cache.set(threadId, messages);
            return completions.choices[0].message.content;
        }

        for (const tool of toolCalls) {
            // console.log('tool: ', tool);
            const functionName = tool.function.name;
            const functionParams = tool.function.arguments;

            if (functionName === 'webSearch') {
                const toolResult = await webSearch(JSON.parse(functionParams));
                // console.log('Tool result: ', toolResult);

                messages.push({
                    tool_call_id: tool.id,
                    role: 'tool',
                    name: functionName,
                    content: toolResult,
                });
            }
        }
    }
}
async function webSearch({ query }) {
    // Here we will do tavily api call
    console.log('Calling web search...');

    const response = await tvly.search(query);
    // console.log('Response: ', response);

    const finalResult = response.results.map((result) => result.content).join('\n\n');

    return finalResult;
}
