export function createCancelableDelay() {
  let timerId = null;

  const cancel = () => {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
    }
  };

  return {
    schedule(callback, delay) {
      cancel();
      timerId = setTimeout(() => {
        timerId = null;
        callback();
      }, delay);
    },
    cancel,
  };
}
