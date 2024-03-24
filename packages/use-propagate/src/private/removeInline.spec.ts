/** @jest-environment jsdom */

import removeInline from './removeInline';

test('should remove a single item', () => {
  const array = [1, 2, 3, 4, 5];

  removeInline(array, 3);

  expect(array).toEqual([1, 2, 4, 5]);
});

test('should remove the first item', () => {
  const array = [1, 2, 3, 4, 5];

  removeInline(array, 1);

  expect(array).toEqual([2, 3, 4, 5]);
});

test('should remove the last item', () => {
  const array = [1, 2, 3, 4, 5];

  removeInline(array, 5);

  expect(array).toEqual([1, 2, 3, 4]);
});

test('when removing non-existent item should keep as-is', () => {
  const array = [1, 2, 3, 4, 5];

  removeInline(array, 0);

  expect(array).toEqual([1, 2, 3, 4, 5]);
});

test('should remove all instance of an item', () => {
  const array = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];

  removeInline(array, 3);

  expect(array).toEqual([1, 1, 2, 2, 4, 4, 5, 5]);
});

test('should remove all items', () => {
  const array = [1, 2, 3, 4, 5];

  removeInline(array, 2, 3, 4);

  expect(array).toEqual([1, 5]);
});
