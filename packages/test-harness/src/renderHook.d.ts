declare type RenderHookResult<T = any, P = {}> = {
  rerender: (props: P) => void;
  result: { current: T };
};

declare const cleanup: () => void;
declare const renderHook: <T, P>(render: (props: P) => T, options?: { initialProps: P }) => RenderHookResult;

declare const export_: { cleanup: typeof cleanup; renderHook: typeof renderHook };

export = export_;
