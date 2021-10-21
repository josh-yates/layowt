import { Tab } from "../../src/models/tab";

describe('Tab', () => {
    describe('constructor', () => {
        it('sets the first pane\'s tab to itself', () => {
            const tab = new Tab();

            expect(tab.panes[0].tab).toBe(tab);
        })
    });
});