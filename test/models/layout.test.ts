import { Layout } from "../../src/models/layout";
import { Tab } from "../../src/models/tab";

describe('Layout', () => {
    describe('constructor', () => {
        it('sets the first tabs\'s layout to itself', () => {
            const layout = new Layout();

            expect(layout.tabs[0].layout).toBe(layout);
        })
    });
});