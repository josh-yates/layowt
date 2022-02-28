import { Utils } from '../src/utils';

describe('utils', () => {
    describe('gcd', () => {
        it('Returns the GCD of two numbers', () => {
            expect(Utils.gcd(12, 6)).toBe(6);
            expect(Utils.gcd(5, 15)).toBe(5);
            expect(Utils.gcd(9, 25)).toBe(1);
        });
    });
    describe('gcdArray', () => {
        it('Returns the GCD of multiple numbers', () => {
            expect(Utils.gcdArray([3])).toBe(3);
            expect(Utils.gcdArray([5,15])).toBe(5);
            expect(Utils.gcdArray([14, 7, 63, 700, 35])).toBe(7);
        });
    });
});