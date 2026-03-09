import crypto from 'crypto';

export const V6_NOISE_CONFIG = {
  gateErrorRate: 0.008,
  phaseErrorRate: 0.004,
  amplitudeErrorRate: 0.006,
  crosstalkStrength: 0.01,
  idleSteps: 2
};

const DEFAULT_AGENTS = [
  { id: 'A0', theta: 0.85 * Math.PI, weight: 0.9, epsilon: 0.12, alignmentRate: 0.84, noiseTolerance: 0.76 },
  { id: 'A1', theta: 0.60 * Math.PI, weight: 0.8, epsilon: 0.15, alignmentRate: 0.8, noiseTolerance: 0.72 },
  { id: 'A2', theta: 0.50 * Math.PI, weight: 0.7, epsilon: 0.2, alignmentRate: 0.74, noiseTolerance: 0.68 },
  { id: 'A3', theta: 0.35 * Math.PI, weight: 0.75, epsilon: 0.19, alignmentRate: 0.78, noiseTolerance: 0.71 },
  { id: 'A4', theta: 0.25 * Math.PI, weight: 0.8, epsilon: 0.14, alignmentRate: 0.82, noiseTolerance: 0.74 }
];

function hashSeed(input){
  return crypto.createHash('sha256').update(input).digest('hex').slice(0, 8);
}

function normalizePrompt(prompt){
  return String(prompt || '').trim();
}

function layer1Intent(prompt){
  const normalized = normalizePrompt(prompt);
  const intent = normalized.split(/[?.!]/)[0]?.slice(0, 180) || '';
  return {
    normalized,
    intent,
    tokens: normalized.split(/\s+/).filter(Boolean).length,
    wStateAgentCount: 5,
    threshold: 3
  };
}

function layer2Research(prompt, context = []){
  const cues = ['neden', 'how', 'why', 'karşılaştır', 'compare', 'plan', 'strateji', 'benchmark'];
  const needsResearch = cues.some(c => prompt.toLowerCase().includes(c));
  const scenarioPlan = ['A:sessiz', 'B:gürültü', 'C:gürültü+crosstalk', 'D:gürültü+crosstalk+qec'];

  return {
    needsResearch,
    sources: context.slice(0, 8),
    researchDepth: needsResearch ? 'deep' : 'standard',
    scenarioPlan
  };
}

function buildWStateDistribution(n){
  const p = Number((1 / n).toFixed(3));
  return Array.from({ length: n }, (_, i) => ({ agent: `A${i}`, pOne: p }));
}

function estimateCrosstalk(agents, strength){
  const links = [];
  for(let i=0; i<agents.length-1; i++){
    links.push({
      pair: `${agents[i].id}-${agents[i+1].id}`,
      pEvent: Number((strength ** 2).toFixed(4)),
      leakageForward: strength,
      leakageBackward: strength
    });
  }
  return links;
}

function assignMentorTiers(agents){
  const ranked = [...agents]
    .map(a => ({
      ...a,
      score: Number((0.5 * a.alignmentRate + 0.3 * a.noiseTolerance + 0.2 * (1 - a.epsilon)).toFixed(3))
    }))
    .sort((a,b)=>b.score-a.score);

  return ranked.map((agent, idx) => ({
    ...agent,
    tier: idx === 0 ? 'TIER_1_LEADER' : idx <= 2 ? 'TIER_2_SENIOR' : 'TIER_3_APPRENTICE'
  }));
}

function layer3QuantumDecision(prompt, research){
  const seed = hashSeed(`${prompt}:${research.researchDepth}`);
  const uncertainty = parseInt(seed, 16) % 100;
  const mode = uncertainty > 55 ? 'branch-explore' : 'direct-execute';

  const agents = assignMentorTiers(DEFAULT_AGENTS);
  const wState = buildWStateDistribution(agents.length);
  const crosstalk = estimateCrosstalk(agents, V6_NOISE_CONFIG.crosstalkStrength);
  const majority = agents.filter(a => Math.sin(a.theta) * a.weight > 0.45).length;

  return {
    mode,
    uncertainty,
    majorityVote: majority,
    strictMajority: majority >= Math.floor(agents.length / 2) + 1,
    wState,
    mentorHierarchy: agents.map(a => ({ id: a.id, tier: a.tier, score: a.score })),
    crosstalk
  };
}

function layer4Guardrails(prompt){
  const banned = ['password', 'token leak', 'exploit', 'malware'];
  const hit = banned.find(k => prompt.toLowerCase().includes(k));
  return {
    safe: !hit,
    reason: hit ? `blocked_keyword:${hit}` : 'ok',
    qecScaffold: {
      code: '3-qubit bit-flip',
      schedule: 'after_grover_before_measurement',
      syndromeMap: {
        '00': 'no_error',
        '10': 'fix_data',
        '01': 'fix_anc2',
        '11': 'fix_anc1'
      },
      limitations: ['handles_X_errors', 'not_Z_errors', 'not_multi_error']
    }
  };
}

function layer5Verification({ guardrails, intent, decision }){
  const confidence = guardrails.safe ? Math.max(0.4, (100 - decision.uncertainty) / 100) : 0;
  const coverage = {
    crosstalk: decision.crosstalk.length > 0,
    mentorTiers: decision.mentorHierarchy.length === 5,
    wState: decision.wState.length === 5,
    qec: Boolean(guardrails.qecScaffold)
  };

  return {
    pass: guardrails.safe,
    confidence: Number(confidence.toFixed(2)),
    summary: guardrails.safe
      ? `intent=${intent.intent || 'general'}, mode=${decision.mode}, majority=${decision.majorityVote}/5`
      : 'request blocked by guardrails',
    coverage
  };
}

export function buildV6ScenarioBenchmark(){
  return [
    { scenario: 'A', description: '5-ajan sessiz simülatör', qec: false, crosstalk: false },
    { scenario: 'B', description: '5-ajan tam gürültü (T1+T2+Depol), QEC yok', qec: false, crosstalk: false },
    { scenario: 'C', description: '5-ajan tam gürültü + Crosstalk (ξ=0.010)', qec: false, crosstalk: true },
    { scenario: 'D', description: '5-ajan tam gürültü + Crosstalk + QEC aktif', qec: true, crosstalk: true }
  ];
}

export function runQSharpFiveLayerDecision({ prompt, context }){
  const l1 = layer1Intent(prompt);
  const l2 = layer2Research(l1.normalized, context);
  const l3 = layer3QuantumDecision(l1.normalized, l2);
  const l4 = layer4Guardrails(l1.normalized);
  const l5 = layer5Verification({ guardrails: l4, intent: l1, decision: l3 });

  return {
    version: 'v6',
    noiseConfig: V6_NOISE_CONFIG,
    scenarios: buildV6ScenarioBenchmark(),
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
