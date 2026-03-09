import test from 'node:test';
import assert from 'node:assert/strict';
import { getQuantumCollectiveSkeleton } from '../src/services/quantumCollectiveSkeleton.js';
import { runQSharpFiveLayerDecision } from '../src/services/qsharpDecisionEngine.js';

test('quantum collective skeleton contains v6 extensions', () => {
  const sk = getQuantumCollectiveSkeleton();
  assert.equal(sk.layers.length, 5);
  assert.equal(sk.innovations.length, 4);
  assert.equal(sk.scenarios.length, 4);
  assert.equal(sk.layers[0].id, 'K1');
  assert.equal(sk.layers[4].id, 'K5');
});

test('qsharp decision v6 exposes crosstalk and mentor hierarchy', () => {
  const result = runQSharpFiveLayerDecision({
    prompt: 'v6 benchmark için karar üret',
    context: []
  });

  assert.equal(result.version, 'v6');
  assert.equal(result.layers.quantumDecision.wState.length, 5);
  assert.equal(result.layers.quantumDecision.mentorHierarchy.length, 5);
  assert.equal(result.layers.quantumDecision.crosstalk.length, 4);
  assert.equal(result.layers.safetyGuardrails.qecScaffold.code, '3-qubit bit-flip');
});
