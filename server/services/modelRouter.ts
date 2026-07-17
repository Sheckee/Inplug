// Add this at the bottom of the file
export async function streamModel(messages: any[], model: string = 'openai') {
  const apiKey = model === 'openai' ? process.env.OPENAI_API_KEY : process.env.NVIDIA_API_KEY;
  const url = model === 'openai' 
    ? 'https://api.openai.com/v1/chat/completions'
    : 'https://integrate.api.nvidia.com/v1/chat/completions';
  const modelName = model === 'openai' ? 'gpt-4o' : 'meta/llama-3.1-405b-instruct';

  if (!apiKey) throw new Error(`API key for ${model} not set`);

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: modelName,
      messages,
      stream: true,
    }),
  });

  if (!resp.ok || !resp.body) {
    throw new Error(`API error: ${resp.statusText}`);
  }

  return resp.body; // ReadableStream<Uint8Array>
}
