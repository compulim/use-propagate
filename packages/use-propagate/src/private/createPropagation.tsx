import React from 'react';
import { createContext, memo, useContext, useEffect, useLayoutEffect, useMemo, type ReactNode } from 'react';
import { useRefFrom } from 'use-ref-from';
import createPropagationContextValue, { Listener, PropagationContext } from './createPropagateContextValue';

type Init = {
  /**
   * `true` to allows calling propagate callback function during render-time, otherwise, `false` (default).
   *
   * Propagation during render-time is normally discouraged. If listeners save the value into a state, multiple re-render could occur.
   * This option prevents render deadlock by disallowing propagation during render-time.
   */
  allowPropagateDuringRender?: boolean | undefined;
};

export default function createPropagation<T>(init: Init = {}) {
  type Fn = Listener<T>;

  const { allowPropagateDuringRender } = init;
  const context = createContext<PropagationContext<T>>(createPropagationContextValue());

  let rendering: boolean = false;

  function PropagationScope({ children }: Readonly<{ children?: ReactNode | undefined }>) {
    const value = useMemo<PropagationContext<T>>(createPropagationContextValue, []);
    return <context.Provider value={value}>{children}</context.Provider>;
  }

  return {
    PropagationScope: memo(PropagationScope),
    useListen: (listener: Fn) => {
      const listenerRef = useRefFrom(listener);
      const { addListener, removeListener } = useContext(context);

      const wrappingListener = useMemo(() => {
        const wrappingListener: Fn = value => listenerRef.current(value);

        addListener(wrappingListener);

        return wrappingListener;
      }, [listenerRef]);

      useEffect(() => () => removeListener(wrappingListener), [wrappingListener]);
    },
    usePropagate: () => {
      rendering = true;
      const { runListeners } = useContext(context);

      useLayoutEffect(() => {
        rendering = false;
      });

      return (value: T) => {
        if (rendering && !allowPropagateDuringRender) {
          return console.warn(
            'use-propagate: The propagate callback function should not be called while rendering, ignoring the call.'
          );
        }

        runListeners(value);
      };
    }
  };
}
