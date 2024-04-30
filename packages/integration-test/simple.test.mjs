/** @jest-environment jsdom */

import { act } from '@testing-library/react';
import { createPropagation } from 'use-propagate';

const renderHook =
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@testing-library/react').renderHook ||
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@testing-library/react-hooks').renderHook;

test('When a value is being propagated, listener should receive the value', () => {
  const { useListen, usePropagate } = createPropagation();
  const listener = jest.fn();
  let propagate;

  renderHook(() => {
    propagate = usePropagate();

    useListen(listener);
  });

  expect(listener).toHaveBeenCalledTimes(0);

  act(() => propagate('Hello, World!'));

  expect(listener).toHaveBeenCalledTimes(1);
  expect(listener).toHaveBeenNthCalledWith(1, 'Hello, World!');
});
