/** @jest-environment jsdom */

import { act, renderHook } from '@testing-library/react';
import { createPropagation } from 'use-propagate';

test('When a value is being propagated, listener should receive the value', () => {
  const { Provider, useListen, usePropagate } = createPropagation();
  const listener = jest.fn();

  const result = renderHook(
    ({ value }) => {
      const propagate = usePropagate();

      useListen(listener);

      typeof value === 'undefined' || propagate(value);
    },
    { initialProps: {}, wrapper: Provider }
  );

  expect(listener).toHaveBeenCalledTimes(0);

  act(() => result.rerender({ value: 'Hello, World!' }));

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenNthCalledWith(1, 'Hello, World!');
});
