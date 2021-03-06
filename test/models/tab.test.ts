import { Layout } from "../../src/models/layout";
import { Tab } from "../../src/models/tab";

describe('Tab', () => {
    describe('constructor', () => {
        it('sets the first pane\'s tab to itself', () => {
            const layout = new Layout();
            const tab = new Tab(layout);

            expect(tab.panes[0].tab).toBe(tab);
        })
    });
});