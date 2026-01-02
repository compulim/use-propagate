import { renderHook } from '@compulim/test-harness/renderHook';
import { expect } from 'expect';
import { mock, test } from 'node:test';
import { act } from '@testing-library/react';
import { createPropagation } from 'use-propagate';

test('When a value is being propagated, listener should receive the value', () => {
  const { useListen, usePropagate } = createPropagation();
  const listener = mock.fn();
  let propagate;

  renderHook(() => {
    propagate = usePropagate();

    useListen(listener);
  });

  expect(listener.mock.callCount()).toBe(0);

  act(() => propagate('Hello, World!'));

  expect(listener.mock.callCount()).toBe(1);
  expect(listener.mock.calls[0]?.arguments).toEqual(['Hello, World!']);
});
