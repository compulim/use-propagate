import { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useRefFrom } from 'use-ref-from';

type Listener<T> = (value: T) => void;

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

  let rendering: boolean = false;

  const { allowPropagateDuringRender } = init;
  const listeners: Set<Fn> = new Set();

  const addListener = (listener: Fn): void => void listeners.add(listener);
  const removeListener = (listener: Fn): void => void listeners.delete(listener);
  const usePropagate = () => {
    rendering = true;

    useLayoutEffect(() => {
      rendering = false;
    });

    return (value: T) => {
      if (rendering && !allowPropagateDuringRender) {
        return console.warn(
          'use-propagate: The propagate callback function should not be called while rendering, ignoring the call.'
        );
      }

      listeners.forEach(listener => listener(value));
    };
  };

  return {
    useListen: (listener: Fn) => {
      const listenerRef = useRefFrom(listener);
      const wrappingListener = useCallback((value: T) => listenerRef.current(value), [listenerRef]);

      useMemo(() => addListener(wrappingListener), [wrappingListener]);
      useEffect(() => () => removeListener(wrappingListener), [wrappingListener]);
    },
    usePropagate
  };
}
