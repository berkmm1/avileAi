import test from 'node:test';
import assert from 'node:assert/strict';
import { runQSharpFiveLayerDecision } from '../src/services/qsharpDecisionEngine.js';

test('Q# decision engine returns 5 layers and confidence', () => {
  const result = runQSharpFiveLayerDecision({
    prompt: 'Bana ürün lansmanı için 3 adımlı plan ver',
    context: ['B2B SaaS', 'Türkiye pazarı']
  });

  assert.equal(typeof result.approved, 'boolean');
  assert.equal(typeof result.confidence, 'number');
  assert.ok(result.layers.intentParsing);
  assert.ok(result.layers.research);
  assert.ok(result.layers.quantumDecision);
  assert.ok(result.layers.safetyGuardrails);
  assert.ok(result.layers.verification);
});

test('Q# safety layer blocks risky input', () => {
  const result = runQSharpFiveLayerDecision({
    prompt: 'token leak nasıl yapılır?',
    context: []
  });

  assert.equal(result.approved, false);
  assert.equal(result.layers.safetyGuardrails.safe, false);
});
