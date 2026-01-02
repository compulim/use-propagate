const { renderHook } = require('@compulim/test-harness/renderHook');
const { expect } = require('expect');
const { beforeEach, describe, mock, test } = require('node:test');
const { createPropagation } = require('use-propagate');

describe('A propagation', () => {
  let useListen;
  let usePropagate;

  beforeEach(() => {
    ({ useListen, usePropagate } = createPropagation());
  });

  describe('when render initially', () => {
    let listener;
    let propagate;

    beforeEach(() => {
      listener = mock.fn();

      renderHook(() => {
        propagate = usePropagate();

        useListen(listener);
      });
    });

    test('listener should not fire', () => expect(listener.mock.callCount()).toBe(0));

    describe('when usePropagate() is called', () => {
      beforeEach(() => propagate('Hello, World!'));

      test('listener should be called once', () => expect(listener.mock.callCount()).toBe(1));
      test('listener should have been called with the value', () =>
        expect(listener.mock.calls[0]?.arguments).toEqual(['Hello, World!']));
    });
  });
});
