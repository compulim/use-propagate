/** @type {() => void} */
let cleanup;
/** @type {<T, P>(render: (props: P) => T, options?: { initialProps: P }) => { rerender: (props: P) => void; result: { current: T } }} */
let renderHook;

try {
  // eslint-disable-next-line import/no-unresolved
  ({ cleanup, renderHook } = await import('@testing-library/react-hooks'));
} catch {
  ({ cleanup, renderHook } = await import('@testing-library/react'));
}

export { cleanup, renderHook };
