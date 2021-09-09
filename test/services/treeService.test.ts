import { TreeService } from "../../src/services/treeService";
import type { TreeNode } from "../../src/models/treeNode";
import { TreeNodeStore } from "../../src/services/treeNodeStore";
import { SplitType } from "../../src/models/splitType";

let treeNodeStore: TreeNodeStore;
let sut: TreeService;

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

    node1 = treeNodeStore.nodes[0];
    node1.content = "1";

    treeNodeStore.split(node1, SplitType.Vertical);
    treeNodeStore.split(node1, SplitType.Vertical);

    node3 = node1.children[0];
    node3.content = "3";

    node2 = node1.children[1];
    node2.content = "2";

    treeNodeStore.split(node3, SplitType.Horizontal);
    treeNodeStore.split(node3, SplitType.Vertical);

    node5 = node3.children[0];
    node5.content = "5";

    node4 = node3.children[1];
    node4.content = "4";

    treeNodeStore.split(node2, SplitType.Horizontal);
    treeNodeStore.split(node2, SplitType.Horizontal);

    node6 = node2.children[0];
    node6.content = "6";

    node8 = node2.children[1];
    node8.content = "8";

    treeNodeStore.split(node6, SplitType.Vertical);

    node7 = node6.children[0];
    node7.content = "7";
};

beforeEach(() => {
    treeNodeStore = new TreeNodeStore();
    sut = new TreeService(treeNodeStore);
    setupScenario1();
});

describe('TreeService', () => {
    describe('getStepsTo', () => {
        it('Calculates steps correctly', () => {
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

            treeNodeStore.nodes.forEach(n => {
                const stepsV = sut.getStepsTo(n, SplitType.Vertical);
                const stepsH = sut.getStepsTo(n, SplitType.Horizontal);

                const expected = expectedResults.filter(r => r.key === n)[0];

                console.log(`Node content: '${n.content}', stepsV: ${stepsV}, stepsH: ${stepsH}'`);

                expect(stepsV).toBe(expected.stepsV);
                expect(stepsH).toBe(expected.stepsH);
            });
        });
    });
});