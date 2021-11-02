import { Layout } from "../../src/models/layout";
import { TabService } from "../../src/services/tabService";

let sut: TabService;
let layout: Layout;

beforeEach(() => {
    sut = new TabService();
    layout = new Layout();
});

describe('TabService', () => {
    describe('add', () => {
        it('Adds a new tab to the layout', () => {
            sut.add(layout);

            expect(layout.tabs.length).toBe(2);
            expect(layout.tabs[1]).toBeTruthy();
        });
    });

    describe('remove', () => {
        it('Removes a tab from the layout', () => {
            const firstTab = layout.tabs[0];

            sut.add(layout);

            const secondTab = layout.tabs[1];

            sut.remove(firstTab);

            expect(layout.tabs.length).toBe(1);
            expect(layout.tabs[0]).toBe(secondTab);
        });

        it('Does not allow the last tab to be removed', () => {
            expect(() => sut.remove(layout.tabs[0])).toThrow();
        });
    });
});