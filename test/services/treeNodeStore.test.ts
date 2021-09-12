import { SplitType } from '../../src/models/splitType';
import type { TreeNode } from '../../src/models/treeNode';
import { TreeNodeStore } from '../../src/services/treeNodeStore';

let sut: TreeNodeStore;

let node1: TreeNode;
let node2: TreeNode;
let node3: TreeNode;
let node4: TreeNode;
let node5: TreeNode;
let node6: TreeNode;
let node7: TreeNode;
let node8: TreeNode;

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

    node1 = sut.nodes[0];
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

beforeEach(() => sut = new TreeNodeStore());

describe('TreeNodeStore', () => {
    describe('constructor', () => {
        it('Creates a single node', () => expect(sut.nodes.length).toBe(1))
    });
    describe('split', () => {
        it('Creates a new node in the store', () => {
            sut.split(sut.nodes[0], SplitType.Horizontal);

            expect(sut.nodes.length).toBe(2);
        });
        it('Adds the new node to the original node\'s children', () => {
            const originalNode = sut.nodes[0];
            sut.split(originalNode, SplitType.Horizontal);

            const newNode = sut.nodes[1];

            expect(originalNode.children).toContain(newNode);
        });
        it('Adds the original node as the new node\'s parent', () => {
            const originalNode = sut.nodes[0];
            sut.split(originalNode, SplitType.Horizontal);

            const newNode = sut.nodes[1];

            expect(newNode.parent).toBe(originalNode);
        });
        it('Sets the split type on the new node', () => {
            sut.split(sut.nodes[0], SplitType.Vertical);

            const newNode = sut.nodes[1];

            expect(newNode.parentSplit).toBe(SplitType.Vertical);
        });
    });
    describe('remove', () => {
        it('Removes the node from the store', () => {
            sut.split(sut.nodes[0], SplitType.Horizontal);

            const nodeToRemove = sut.nodes[1];

            sut.remove(nodeToRemove);

            expect(sut.nodes.includes(nodeToRemove)).toBe(false);
        });
        it('Does not allow the last node to be removed', () => {
            expect(() => sut.remove(sut.nodes[0])).toThrow();
        });
        it('Removes the node from its parent\'s children', () => {
            const parentNode = sut.nodes[0];
            
            sut.split(sut.nodes[0], SplitType.Horizontal);

            const childNode = sut.nodes[0];

            sut.remove(childNode);

            expect(parentNode.children).not.toContain(childNode);
        });
        it('Replaces itself with last child when it has children (without parent)', () => {
            const nodeToRemove = sut.nodes[0];

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
            const topLevelParent = sut.nodes[0];
            
            sut.split(topLevelParent, SplitType.Horizontal);

            const nodeToRemove = sut.nodes[1];

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

            const expectedResults: { key: TreeNode, stepsV: number, stepsH: number }[] = [];

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
                stepsH: 0
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

            sut.nodes.forEach(n => {
                const stepsV = sut.getStepsTo(n, SplitType.Vertical);
                const stepsH = sut.getStepsTo(n, SplitType.Horizontal);

                const expected = expectedResults.filter(r => r.key === n)[0];

                console.log(`Node content: '${n.content}', stepsV: ${stepsV}, stepsH: ${stepsH}'`);

                expect(stepsV).toBe(expected.stepsV);
                expect(stepsH).toBe(expected.stepsH);
            });
        });
    });
})