import { TabStore } from '../../src/services/tabStore';

let sut: TabStore;

beforeEach(() => sut = new TabStore());

describe('TabStore', () => {
    describe('constructor', () => {
        it('Creates a single tab', () => expect(sut.tabs.length).toBe(1))
    });

    describe('add', () => {
        it('Adds a new tab to the store', () => {
            sut.add();

            expect(sut.tabs.length).toBe(2);
            expect(sut.tabs[1]).toBeTruthy();
        });
    });

    describe('remove', () => {
        it('Removes a tab from the store', () => {
            const firstTab = sut.tabs[0];

            sut.add();

            const secondTab = sut.tabs[1];

            sut.remove(firstTab);

            expect(sut.tabs.length).toBe(1);
            expect(sut.tabs[0]).toBe(secondTab);
        });

        it('Does not allow the last tab to be removed', () => {
            expect(() => sut.remove(sut.tabs[0])).toThrow();
        });
    });
});