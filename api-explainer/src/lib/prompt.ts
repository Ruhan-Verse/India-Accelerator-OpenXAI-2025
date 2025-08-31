export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export function buildPrompt(messages: ChatMessage[], isJson: boolean): string {
  const latestUser = [...messages].reverse().find(m => m.role === 'user');
  const userContent = latestUser?.content ?? '';
  if (isJson) {
    return [
      'You are an API Response Explainer. Your job is to explain a JSON response in simple, beginner-friendly language.',
      'Rules: concise, clear, avoid jargon, call out assumptions, do not invent fields.',
      'Output format:',
      '- Summary',
      '- Fields (path, type, meaning, example)',
      '- Notes & pitfalls',
      '- Short example usage',
      '',
      'JSON to explain:',
      '<json>',
      userContent,
      '</json>',
    ].join('\n');
  }
  return [
    'You are a helpful assistant focused on explaining APIs and JSON payloads in simple terms.',
    'Answer clearly and concisely. If unsure, say what extra info is needed.',
    '',
    'User message:',
    userContent,
  ].join('\n');
}


