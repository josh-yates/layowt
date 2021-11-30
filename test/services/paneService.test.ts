import { SplitType } from '../../src/models/splitType';
import type { Tab } from '../../src/models/tab';
import type { Pane } from '../../src/models/pane';
import { PaneService } from '../../src/services/paneService';
import { Layout } from '../../src/models/layout';

let sut: PaneService;

let layout: Layout;
let tab: Tab;

let node1: Pane;
let node2: Pane;
let node3: Pane;
let node4: Pane;
let node5: Pane;
let node6: Pane;
let node7: Pane;
let node8: Pane;

function setupScenario1(): void {
    // -----------------
    // |1  |2  |3  |4  |
    // |   |---|   |   |
    // |   |8  |   |   |
    // |   |---|-------|
    // |   |6|7|5      |
    // |   | | |       |
    // |   | | |       |
    // |   | | |       |
    // -----------------
    //            1
    //            |
    //     3-v----|-v-2
    //     |          |
    // 5-H-|-V-4  6-H-|-H-8
    //            |
    //        7-v-|
    //
    // 4 rows, 8 columns
    //
    //   | Steps V | Steps H
    // 1 |    0    |    0
    // 2 |    2    |    0
    // 3 |    1    |    0
    // 4 |    2    |    0
    // 5 |    1    |    1
    // 6 |    2    |    1
    // 7 |    3    |    1
    // 8 |    2    |    2

    node1 = tab.panes[0];
    node1.content = "1";

    sut.split(node1, SplitType.Vertical);
    sut.split(node1, SplitType.Vertical);

    node3 = node1.children[0];
    node3.content = "3";

    node2 = node1.children[1];
    node2.content = "2";

    sut.split(node3, SplitType.Horizontal);
    sut.split(node3, SplitType.Vertical);

    node5 = node3.children[0];
    node5.content = "5";

    node4 = node3.children[1];
    node4.content = "4";

    sut.split(node2, SplitType.Horizontal);
    sut.split(node2, SplitType.Horizontal);

    node6 = node2.children[0];
    node6.content = "6";

    node8 = node2.children[1];
    node8.content = "8";

    sut.split(node6, SplitType.Vertical);

    node7 = node6.children[0];
    node7.content = "7";
};

beforeEach(() => {
    sut = new PaneService();
    layout = new Layout();
    tab = layout.tabs[0];
});

describe('PaneService', () => {
    describe('getRootNode', () => {
        it('Gets the root node', () => {
            const rootNode = tab.panes[0];

            sut.split(rootNode, SplitType.Horizontal);
            sut.split(rootNode, SplitType.Horizontal);
            sut.split(rootNode, SplitType.Horizontal);

            expect(sut.getRootNode(tab)).toBe(rootNode);
        });
    });
    describe('split', () => {
        it('Creates a new node in the store', () => {
            sut.split(tab.panes[0], SplitType.Horizontal);

            expect(tab.panes.length).toBe(2);
        });
        it('Adds the new node to the original node\'s children', () => {
            const originalNode = tab.panes[0];
            sut.split(originalNode, SplitType.Horizontal);

            const newNode = tab.panes[1];

            expect(originalNode.children).toContain(newNode);
        });
        it('Adds the original node as the new node\'s parent', () => {
            const originalNode = tab.panes[0];
            sut.split(originalNode, SplitType.Horizontal);

            const newNode = tab.panes[1];

            expect(newNode.parent).toBe(originalNode);
        });
        it('Sets the split type on the new node', () => {
            sut.split(tab.panes[0], SplitType.Vertical);

            const newNode = tab.panes[1];

            expect(newNode.parentSplit).toBe(SplitType.Vertical);
        });
        it('Clones a pane\'s contents and settings if specified', () => {
            const originalNode = tab.panes[0];

            originalNode.title = 'Title';
            originalNode.content = 'Content';
            originalNode.colourScheme = 'Colour scheme';
            originalNode.directory = 'Directory';
            originalNode.persistTitle = false;
            originalNode.cloneOnSplit = true;

            sut.split(originalNode, SplitType.Horizontal);

            const newNode = originalNode.children[0];

            expect(newNode.title).toBe('Title');
            expect(newNode.content).toBe('Content');
            expect(newNode.colourScheme).toBe('Colour scheme');
            expect(newNode.directory).toBe('Directory');
            expect(newNode.persistTitle).toBe(false);
            expect(newNode.cloneOnSplit).toBe(true);
        });
    });
    describe('remove', () => {
        it('Removes the node from the store', () => {
            sut.split(tab.panes[0], SplitType.Horizontal);

            const nodeToRemove = tab.panes[1];

            sut.remove(nodeToRemove);

            expect(tab.panes.includes(nodeToRemove)).toBe(false);
        });
        it('Does not allow the last node to be removed', () => {
            expect(() => sut.remove(tab.panes[0])).toThrow();
        });
        it('Removes the node from its parent\'s children', () => {
            const parentNode = tab.panes[0];

            sut.split(tab.panes[0], SplitType.Horizontal);

            const childNode = tab.panes[0];

            sut.remove(childNode);

            expect(parentNode.children).not.toContain(childNode);
        });
        it('Replaces itself with last child when it has children (without parent)', () => {
            const nodeToRemove = tab.panes[0];

            sut.split(nodeToRemove, SplitType.Horizontal);
            sut.split(nodeToRemove, SplitType.Horizontal);
            sut.split(nodeToRemove, SplitType.Horizontal);

            const firstChild = nodeToRemove.children[0];
            const secondChild = nodeToRemove.children[1];
            const thirdChild = nodeToRemove.children[2];

            sut.remove(nodeToRemove);

            expect(thirdChild.children[0]).toBe(firstChild);
            expect(thirdChild.children[1]).toBe(secondChild);
            expect(thirdChild.parent).toBeFalsy();
            expect(firstChild.parent).toBe(thirdChild);
            expect(secondChild.parent).toBe(thirdChild);
        });

        it('Replaces itself with last child when it has children (with parent)', () => {
            const topLevelParent = tab.panes[0];

            sut.split(topLevelParent, SplitType.Horizontal);

            const nodeToRemove = tab.panes[1];

            sut.split(nodeToRemove, SplitType.Horizontal);
            sut.split(nodeToRemove, SplitType.Horizontal);
            sut.split(nodeToRemove, SplitType.Horizontal);

            const firstChild = nodeToRemove.children[0];
            const secondChild = nodeToRemove.children[1];
            const thirdChild = nodeToRemove.children[2];

            sut.remove(nodeToRemove);

            expect(thirdChild.children[0]).toBe(firstChild);
            expect(thirdChild.children[1]).toBe(secondChild);
            expect(thirdChild.parent).toBe(topLevelParent);
            expect(firstChild.parent).toBe(thirdChild);
            expect(secondChild.parent).toBe(thirdChild);
        });
    });
    describe('getStepsTo', () => {
        it('Calculates steps correctly', () => {
            setupScenario1();

            const expectedResults: { key: Pane, stepsV: number, stepsH: number }[] = [];

            expectedResults.push({
                key: node1,
                stepsV: 0,
                stepsH: 0
            });
            expectedResults.push({
                key: node2,
                stepsV: 2,
                stepsH: 0
            });
            expectedResults.push({
                key: node3,
                stepsV: 1,
                stepsH: 0
            });
            expectedResults.push({
                key: node4,
                stepsV: 2,
                stepsH: 1
            });
            expectedResults.push({
                key: node5,
                stepsV: 1,
                stepsH: 1
            });
            expectedResults.push({
                key: node6,
                stepsV: 2,
                stepsH: 1
            });
            expectedResults.push({
                key: node7,
                stepsV: 3,
                stepsH: 1
            });
            expectedResults.push({
                key: node8,
                stepsV: 2,
                stepsH: 2
            });

            tab.panes.forEach(n => {
                const stepsV = sut.getStepsTo(n, SplitType.Vertical);
                const stepsH = sut.getStepsTo(n, SplitType.Horizontal);

                const expected = expectedResults.filter(r => r.key === n)[0];

                expect(stepsV).toBe(expected.stepsV);
                expect(stepsH).toBe(expected.stepsH);
            });
        });
    });
    describe('getPriorSiblings', () => {
        it('Returns the prior siblings with the split type', () => {
            const topLevelParent = tab.panes[0];

            sut.split(topLevelParent, SplitType.Horizontal); // 1
            sut.split(topLevelParent, SplitType.Vertical); // 2
            sut.split(topLevelParent, SplitType.Horizontal); // 3
            sut.split(topLevelParent, SplitType.Vertical); // 4
            sut.split(topLevelParent, SplitType.Horizontal); // 5

            const testNode = tab.panes[4];

            const priorSiblings = sut.getPriorSiblings(testNode, SplitType.Horizontal);

            expect(priorSiblings.length).toBe(2);
            expect(priorSiblings[0] === tab.panes[1]).toBe(true);
            expect(priorSiblings[1] === tab.panes[3]).toBe(true);
        });
    });
})