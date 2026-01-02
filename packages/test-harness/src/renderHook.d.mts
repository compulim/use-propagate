declare type RenderHookResult<T = any, P = {}> = {
  rerender: (props: P) => void;
  result: { current: T };
};

declare const cleanup: () => void;
declare const renderHook: <T, P>(render: (props: P) => T, options?: { initialProps: P }) => RenderHookResult;

export { cleanup, renderHook, type RenderHookResult };
