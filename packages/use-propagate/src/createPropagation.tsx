import { useEffect } from 'react';
import { useRefFrom } from 'use-ref-from';

import removeInline from './private/removeInline';

type Listener<T> = (value: T) => void;

export default function createPropagation<T>() {
  type Fn = Listener<T>;

  const listeners: Fn[] = [];

  const addListener = (listener: Fn): void => void listeners.push(listener);
  const removeListener = (listener: Fn): void => removeInline(listeners, listener);
  const usePropagate = () => (value: T) => listeners.forEach(listener => listener(value));

  return {
    useListen: (listener: Fn) => {
      const listenerRef = useRefFrom(listener);

      useEffect(() => {
        const wrappingListener = (value: T) => listenerRef.current(value);

        addListener(wrappingListener);

        return () => removeListener(wrappingListener);
      }, [listenerRef]);
    },
    usePropagate
  };
}
