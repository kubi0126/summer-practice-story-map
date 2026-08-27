const lockStates = new WeakMap();

export function lockBodyScroll(documentObject = document) {
  const { style } = documentObject.body;
  let state = lockStates.get(documentObject);

  if (!state) {
    state = { count: 0, originalOverflow: style.overflow };
    lockStates.set(documentObject, state);
  }

  state.count += 1;
  style.overflow = 'hidden';
  let released = false;

  return () => {
    if (released) return;
    released = true;
    state.count -= 1;

    if (state.count === 0) {
      style.overflow = state.originalOverflow;
      lockStates.delete(documentObject);
    }
  };
}
