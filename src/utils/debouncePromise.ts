export function debouncePromise(f: Function, interval = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(
        () => resolve(f(...args)),
        interval,
      );
    });
  };
}
