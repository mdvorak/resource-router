export type Comparer<T> = (a: T, b: T) => number;

/**
 * Simple array wrapper that sorts on insert, and maintains insert-order for equal elements.
 */
export class SortedArray<T> {
  array: Array<T> = [];

  constructor(public comparer: Comparer<T>) {
  }

  /**
   * Inserts the value while maintaining order defined by the comparer.
   *
   * @param value
   */
  push(value: T) {
    const i = insertLocation(value, this.array, this.comparer);
    this.array.splice(i + 1, 0, value);
  }
}

/**
 * Compare values using < and === operators.
 *
 * @param a First value to be compared.
 * @param b Second value to be compared.
 * @returns {number} 0 if elements equals, -1 if a < b, 1 otherwise.
 */
export function defaultComparer<T>(a: T, b: T) {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

// Based on https://github.com/jo/quick-insert
function locationFor<T>(element: T, array: T[], comparer: Comparer<T>, start: number, end: number): number {
  if (array.length === 0) {
    return -1;
  }

  const pivot = Math.floor((start + end) / 2);
  const c = comparer(element, array[pivot]);

  if (end - start <= 1) {
    return c === -1 ? pivot - 1 : pivot;
  }

  if (c === 0) {
    return pivot;
  } else if (c < 0) {
    return locationFor(element, array, comparer, start, pivot);
  } else {
    return locationFor(element, array, comparer, pivot, end);
  }
}

// This is for "push" behavior, we need to preserve insert order for equal values
function insertLocation<T>(element: T, array: T[], comparer: Comparer<T>): number {
  // Find possible insert location
  let i = locationFor(element, array, comparer, 0, array.length);

  // We need to do append and maintain insert order
  if (i >= 0) {
    while (i < array.length - 1 && comparer(array[i], array[i + 1]) === 0) {
      ++i;
    }
  }

  return i;
}
