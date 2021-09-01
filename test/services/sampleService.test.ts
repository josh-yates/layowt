import { SampleService } from '../../src/services/sampleService';

const sut = new SampleService();

describe('calculate', function () {
    it('add', function () {
        let result = sut.doThing();
        expect(result).toBe(7);
    });
});