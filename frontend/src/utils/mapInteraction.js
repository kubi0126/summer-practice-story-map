export const MIN_ZOOM = 1;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.15;

export function calculateWheelZoom(currentZoom, deltaY) {
  const direction = deltaY > 0 ? -1 : 1;
  const nextZoom = Math.max(
    MIN_ZOOM,
    Math.min(MAX_ZOOM, currentZoom + direction * ZOOM_STEP)
  );
  const zoom = Math.round(nextZoom * 100) / 100;

  return {
    zoom,
    changed: zoom !== currentZoom,
  };
}

export function calculateDragOffset(start, pointer) {
  return {
    x: start.offsetX + pointer.x - start.x,
    y: start.offsetY + pointer.y - start.y,
  };
}
