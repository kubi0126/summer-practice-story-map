import test from 'node:test';
import assert from 'node:assert/strict';

import { lockBodyScroll } from '../src/utils/scrollLock.js';

test('nested overlays restore body overflow only after the final lock is released', () => {
  const documentObject = { body: { style: { overflow: 'auto' } } };

  const releaseDrawer = lockBodyScroll(documentObject);
  const releaseLightbox = lockBodyScroll(documentObject);
  assert.equal(documentObject.body.style.overflow, 'hidden');

  releaseLightbox();
  assert.equal(documentObject.body.style.overflow, 'hidden');

  releaseDrawer();
  assert.equal(documentObject.body.style.overflow, 'auto');
});

test('releasing the same scroll lock twice is harmless', () => {
  const documentObject = { body: { style: { overflow: '' } } };
  const release = lockBodyScroll(documentObject);

  release();
  release();

  assert.equal(documentObject.body.style.overflow, '');
});
