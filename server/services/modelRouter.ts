export async function streamModel(messages: any[], model: string = 'openai') {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY not set');

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true,
    }),
  });

  if (!resp.ok || !resp.body) {
    throw new Error(`OpenAI error: ${resp.statusText}`);
  }

  return resp.body; // ReadableStream<Uint8Array>
}
