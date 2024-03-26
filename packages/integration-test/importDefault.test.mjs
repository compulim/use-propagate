/** @jest-environment jsdom */

import { renderHook } from '@testing-library/react';
import { createPropagation } from 'use-propagate';

describe('A propagation', () => {
  let useListen;
  let usePropagate;

  beforeEach(() => {
    ({ useListen, usePropagate } = createPropagation());
  });

  describe('when render initially', () => {
    let listener;
    let result;

    beforeEach(() => {
      listener = jest.fn();

      result = renderHook(
        ({ value }) => {
          const propagate = usePropagate();

          useListen(listener);

          if (typeof value !== 'undefined') {
            propagate(value);
          }
        },
        { initialProps: {} }
      );
    });

    test('listener should not fire', () => expect(listener).toHaveBeenCalledTimes(0));

    describe('when usePropagate() is called', () => {
      beforeEach(() => result.rerender({ value: 'Hello, World!' }));

      test('listener should be called once', () => expect(listener).toHaveBeenCalledTimes(1));
      test('listener should have been called with the value', () =>
        expect(listener).toHaveBeenNthCalledWith(1, 'Hello, World!'));
    });
  });
});
