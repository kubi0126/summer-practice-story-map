import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateWheelZoom,
  calculateDragOffset,
} from '../src/utils/mapInteraction.js';

test('wheel at the minimum zoom leaves the event available for page scrolling', () => {
  assert.deepEqual(calculateWheelZoom(1, 120), {
    zoom: 1,
    changed: false,
  });
});

test('wheel captures the event only when it changes the map zoom', () => {
  assert.deepEqual(calculateWheelZoom(1, -120), {
    zoom: 1.15,
    changed: true,
  });
  assert.deepEqual(calculateWheelZoom(3, -120), {
    zoom: 3,
    changed: false,
  });
});

test('pointer dragging adds movement to the starting offset', () => {
  assert.deepEqual(
    calculateDragOffset(
      { x: 100, y: 80, offsetX: 20, offsetY: -10 },
      { x: 130, y: 60 }
    ),
    { x: 50, y: -30 }
  );
});
