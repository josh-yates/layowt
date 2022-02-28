export namespace Utils {
    // https://stackoverflow.com/a/17445304
    export function gcd(a: number, b: number): number {
        if (!b) {
            return a;
        }

        return gcd(b, a % b);
    }

    // https://www.geeksforgeeks.org/how-to-calculate-greatest-common-divisor-of-two-or-more-numbers-arrays-in-javascript/
    export function gcdArray(numbers: number[]): number {
        let result = numbers[0];
        
        for (let i = 1; i < numbers.length; i++) {
            result = gcd(numbers[i], result);
  
            if (result == 1) {
                return 1;
            }
        }
        return result;
    }
}