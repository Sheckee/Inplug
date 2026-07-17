export async function modelRouter(messages: any[], preferredModel?: string) {
  const model = preferredModel || 'openai';
  // Simplified fallback logic
  const providers: Record<string, (msgs: any[]) => Promise<string>> = {
    openai: async (msgs) => {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'gpt-4o', messages: msgs })
      });
      const data = await resp.json();
      return data.choices[0].message.content;
    },
    // Add Anthropic, Gemini, etc.
  };

  const handler = providers[model];
  if (!handler) throw new Error('Model not supported');
  return handler(messages);
}
