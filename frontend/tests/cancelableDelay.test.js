import test from 'node:test';
import assert from 'node:assert/strict';

import { createCancelableDelay } from '../src/utils/cancelableDelay.js';

test('scheduling a new callback cancels the previous pending callback', async () => {
  const calls = [];
  const delay = createCancelableDelay();

  delay.schedule(() => calls.push('old'), 10);
  delay.schedule(() => calls.push('new'), 10);
  await new Promise((resolve) => setTimeout(resolve, 30));

  assert.deepEqual(calls, ['new']);
});

test('cancel prevents the pending callback from running', async () => {
  const calls = [];
  const delay = createCancelableDelay();

  delay.schedule(() => calls.push('unexpected'), 10);
  delay.cancel();
  await new Promise((resolve) => setTimeout(resolve, 30));

  assert.deepEqual(calls, []);
});
