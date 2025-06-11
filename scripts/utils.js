// utils.js
export function sanitize(input) {
  return input.replace(/["'`]/g, '');
}

export function buildPrompt(chunks, scores, question) {
  return `
You are a helpful assistant. Use the excerpts below to answer the user's question. Cite sources.

${chunks.map(
  (c, i) => `Source ${i + 1} (score: ${scores[i].toFixed(3)}):\n${c}`
).join('\n\n---\n\n')}

User: "${sanitize(question)}"

Answer concisely and cite sources like [Source 1].
`.trim();
}
