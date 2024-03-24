/** @jest-environment jsdom */

import { act, render, renderHook, type RenderHookResult, type RenderResult } from '@testing-library/react';
import { useCallback, type ComponentType } from 'react';
import createPropagation from './createPropagation';

type Props = { value?: number | undefined };

describe('A propagation', () => {
  let Provider: ReturnType<typeof createPropagation<number>>['Provider'];
  let useListen: ReturnType<typeof createPropagation<number>>['useListen'];
  let usePropagate: ReturnType<typeof createPropagation<number>>['usePropagate'];

  beforeEach(() => {
    ({ Provider, useListen, usePropagate } = createPropagation<number>());
  });

  describe('', () => {
    beforeEach(() => jest.spyOn(console, 'error').mockImplementation(jest.fn()));
    afterEach(() => jest.restoreAllMocks());

    test('calling useListen() without <Provider> should throw', () => {
      expect(() => {
        renderHook(() => {
          useListen(() => {});

          return false;
        });
      }).toThrow('This hook can only used under its corresponding <Provider>.');
    });

    test('calling usePropagate() without <Provider> should throw', () => {
      expect(() => {
        renderHook(() => {
          usePropagate()(0);

          return false;
        });
      }).toThrow('This hook can only used under its corresponding <Provider>.');
    });
  });

  describe('when render initially', () => {
    let listener: jest.Mock<void, [number]>;
    let result: RenderHookResult<void, Props>;

    beforeEach(() => {
      listener = jest.fn<void, [number]>();

      result = renderHook<void, Props>(
        ({ value }) => {
          const propagate = usePropagate();

          useListen(listener);

          if (typeof value !== 'undefined') {
            propagate(value);
          }
        },
        { initialProps: {}, wrapper: Provider }
      );
    });

    test('listener should not fire', () => expect(listener).toHaveBeenCalledTimes(0));

    describe('when usePropagate() is called', () => {
      beforeEach(() => result.rerender({ value: 1 }));

      test('listener should be called once', () => expect(listener).toHaveBeenCalledTimes(1));
      test('listener should have been called with the value', () => expect(listener).toHaveBeenNthCalledWith(1, 1));
    });
  });

  describe('when 2 children listening', () => {
    let count: number;
    let fns: [jest.Mock<void, [number]>, jest.Mock<void, [number]>];
    let Listener: ComponentType<{ index: 0 | 1 }>;
    let Propagator: ComponentType<object>;

    beforeEach(() => {
      count = 0;
      fns = [jest.fn<void, [number]>(), jest.fn<void, [number]>()];

      Listener = ({ index }: { index: 0 | 1 }) => {
        useListen(value => fns[index](value));

        return false;
      };

      Propagator = () => {
        const propagate = usePropagate();
        const handleClick = useCallback(() => propagate(++count), [propagate]);

        return <button data-testid="propagator" type="button" onClick={handleClick} />;
      };
    });

    describe('when render initially', () => {
      let result: RenderResult;

      beforeEach(() => {
        result = render(
          <Provider>
            <Propagator />
            <Listener index={0} />
            <Listener index={1} />
          </Provider>
        );
      });

      test('listeners should not be called', () => {
        expect(fns[0]).toHaveBeenCalledTimes(0);
        expect(fns[1]).toHaveBeenCalledTimes(0);
      });

      describe('when usePropagate is called', () => {
        beforeEach(() => act(() => result.queryByTestId('propagator')?.click()));

        test('listeners should be called once', () => {
          expect(fns[0]).toHaveBeenCalledTimes(1);
          expect(fns[0]).toHaveBeenNthCalledWith(1, 1);

          expect(fns[1]).toHaveBeenCalledTimes(1);
          expect(fns[1]).toHaveBeenNthCalledWith(1, 1);
        });

        describe('when a child is unmounted', () => {
          beforeEach(() =>
            result.rerender(
              <Provider>
                <Propagator />
                <Listener index={0} />
              </Provider>
            )
          );

          describe('when usePropagate is called again', () => {
            beforeEach(() => act(() => result.queryByTestId('propagator')?.click()));

            test('mounted listener should be called again', () => {
              expect(fns[0]).toHaveBeenCalledTimes(2);
              expect(fns[0]).toHaveBeenNthCalledWith(2, 2);
            });

            test('unmounted listener should not be called', () => {
              expect(fns[1]).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
    });
  });
});
