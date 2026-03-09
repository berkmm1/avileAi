import logger from '../utils/logger.js';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1';

const HF_URL = process.env.HF_INFERENCE_URL || 'https://api-inference.huggingface.co/models/google/flan-t5-large';
const HF_TOKEN = process.env.HF_API_TOKEN || '';

async function tryOllama(prompt){
  const res = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false })
  });
  if(!res.ok) throw new Error(`ollama_${res.status}`);
  const data = await res.json();
  return data.response || '';
}

async function tryHuggingFace(prompt){
  const headers = { 'Content-Type': 'application/json' };
  if(HF_TOKEN) headers.Authorization = `Bearer ${HF_TOKEN}`;

  const res = await fetch(HF_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 300 } })
  });
  if(!res.ok) throw new Error(`hf_${res.status}`);
  const data = await res.json();
  if(Array.isArray(data) && data[0]?.generated_text) return data[0].generated_text;
  if(typeof data?.generated_text === 'string') return data.generated_text;
  return JSON.stringify(data);
}

export async function generateAssistantAnswer({ prompt, decisionMeta }){
  const systemPrefix = [
    'You are AliveAI assistant.',
    'Follow the decision meta strictly.',
    `Decision mode: ${decisionMeta.layers.quantumDecision.mode}`,
    `Confidence: ${decisionMeta.confidence}`
  ].join('\n');
  const fullPrompt = `${systemPrefix}\n\nUser:\n${prompt}`;

  try{
    return await tryOllama(fullPrompt);
  }catch(err){
    logger.warn('Ollama unavailable, trying HuggingFace: '+err.message);
  }

  try{
    return await tryHuggingFace(fullPrompt);
  }catch(err){
    logger.warn('HuggingFace unavailable, using fallback: '+err.message);
  }

  return 'Şu anda AI sağlayıcılarına erişemiyorum. Lütfen kısa ve net bir istemle tekrar deneyin.';
}
