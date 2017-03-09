import { SortedArray, defaultComparer } from './sorted-array';

describe('SortedArray', () => {
    it('should insert single element', () => {
        const sorted = new SortedArray(defaultComparer);
        sorted.push(42);

        expect(sorted.array).toEqual([42]);
    });

    it('should maintain order', () => {
        const sorted = new SortedArray<number>(defaultComparer);
        sorted.push(10);
        sorted.push(20);
        sorted.push(30);
        sorted.push(Number.MAX_SAFE_INTEGER);
        sorted.push(Number.MIN_SAFE_INTEGER);
        sorted.push(0);
        sorted.push(25);
        sorted.push(-10);
        sorted.push(40);
        sorted.push(-5);
        sorted.push(5);
        sorted.push(25);

        const expected = [Number.MIN_SAFE_INTEGER, -10, -5, 0, 5, 10, 20, 25, 25, 30, 40, Number.MAX_SAFE_INTEGER];

        expect(sorted.array).toEqual(expected);

        // Re-validate
        sorted.array.sort(defaultComparer);
        expect(sorted.array).toEqual(expected);
    });

    it('should maintain insert order', () => {
        const sorted = new SortedArray<Sample>((a, b) => defaultComparer(a.v, b.v));

        const v1 = {v: 10, n: 'v1'};
        const v2 = {v: 30, n: 'v2'};
        const v3 = {v: 10, n: 'v3'};

        sorted.push(v1);
        sorted.push(v2);
        sorted.push(v3);
        sorted.push(v1);

        expect(sorted.array).toEqual([v1, v3, v1, v2]);
    });
});

interface Sample {
    v: number;
}
