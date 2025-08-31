import { NextResponse } from 'next/server';
import { buildPrompt } from '@/lib/prompt';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export const runtime = 'nodejs';

async function streamFromOllama(prompt: string, options?: { temperature?: number; model?: string }) {
  const controller = new TransformStream();
  const writer = controller.writable.getWriter();

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options?.model ?? 'llama3',
      prompt,
      stream: true,
      options: { temperature: options?.temperature ?? 0.2 },
    }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const textEncoder = new TextEncoder();

  (async () => {
    try {
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += new TextDecoder().decode(value);
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.response) {
              await writer.write(textEncoder.encode(json.response));
            }
            if (json.done) {
              break;
            }
          } catch {
            // ignore malformed lines
          }
        }
      }
    } catch (err) {
      // swallow, will close below
    } finally {
      await writer.close();
    }
  })();

  return controller.readable;
}

// prompt building moved to src/lib/prompt

export async function POST(req: Request) {
  try {
    const { messages, isJson, temperature, model }: { messages: ChatMessage[]; isJson?: boolean; temperature?: number; model?: string } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'messages array is required' }, { status: 400 });
    }

    const prompt = buildPrompt(messages, Boolean(isJson));
    const readable = await streamFromOllama(prompt, { temperature, model });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err: any) {
    const message = err?.message || 'Unexpected error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


