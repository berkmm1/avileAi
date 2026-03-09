import crypto from 'crypto';

function hashSeed(input){
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 8);
}

function normalizePrompt(prompt){
  return String(prompt || '').trim();
}

function layer1Intent(prompt){
  const normalized = normalizePrompt(prompt);
  const intent = normalized.split(/[?.!]/)[0]?.slice(0, 160) || '';
  return { normalized, intent, tokens: normalized.split(/\s+/).filter(Boolean).length };
}

function layer2Research(prompt, context = []){
  const cues = ['neden', 'how', 'why', 'karşılaştır', 'compare', 'plan', 'strateji'];
  const needsResearch = cues.some(c => prompt.toLowerCase().includes(c));
  return {
    needsResearch,
    sources: context.slice(0, 5),
    researchDepth: needsResearch ? 'deep' : 'standard'
  };
}

function layer3QuantumDecision(prompt, research){
  const seed = hashSeed(`${prompt}:${research.researchDepth}`);
  const uncertainty = parseInt(seed, 16) % 100;
  const mode = uncertainty > 55 ? 'branch-explore' : 'direct-execute';
  return { mode, uncertainty };
}

function layer4Guardrails(prompt){
  const banned = ['password', 'token leak', 'exploit'];
  const hit = banned.find(k => prompt.toLowerCase().includes(k));
  return {
    safe: !hit,
    reason: hit ? `blocked_keyword:${hit}` : 'ok'
  };
}

function layer5Verification({ guardrails, intent, decision }){
  const confidence = guardrails.safe ? Math.max(0.35, (100 - decision.uncertainty) / 100) : 0;
  return {
    pass: guardrails.safe,
    confidence: Number(confidence.toFixed(2)),
    summary: guardrails.safe
      ? `intent=${intent.intent || 'general'}, mode=${decision.mode}`
      : 'request blocked by guardrails'
  };
}

export function runQSharpFiveLayerDecision({ prompt, context }){
  const l1 = layer1Intent(prompt);
  const l2 = layer2Research(l1.normalized, context);
  const l3 = layer3QuantumDecision(l1.normalized, l2);
  const l4 = layer4Guardrails(l1.normalized);
  const l5 = layer5Verification({ guardrails: l4, intent: l1, decision: l3 });

  return {
    layers: {
      intentParsing: l1,
      research: l2,
      quantumDecision: l3,
      safetyGuardrails: l4,
      verification: l5
    },
    approved: l5.pass,
    confidence: l5.confidence
  };
}
