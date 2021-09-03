import { SplitType } from '../../src/models/splitType';
import type { TreeNode } from '../../src/models/treeNode';
import { GridService } from '../../src/services/gridService';
import { TreeNodeStore } from '../../src/services/treeNodeStore';

let treeNodeStore: TreeNodeStore;
let sut: GridService;

function setupScenario1(): void {

};

beforeEach(() => {
    treeNodeStore = new TreeNodeStore();
    sut = new GridService(treeNodeStore);
});

describe('GridService', () => {
    describe('gridColumns', () => { });
    describe('gridRows', () => { });
    describe('getIndex', () => {
        it('Calculates index correctly', () => {
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
            //   | X | Y |
            // 1 | 0 | 0 |
            // 2 | 2 | 0 |
            // 3 | 4 | 0 |
            // 4 | 6 | 0 |
            // 5 | 4 | 2 |
            // 6 | 2 | 2 |
            // 7 | 3 | 2 |
            // 8 | 2 | 1 |

            const node1 = treeNodeStore.nodes[0];
            node1.content = "1";

            treeNodeStore.split(node1, SplitType.Vertical);
            treeNodeStore.split(node1, SplitType.Vertical);

            const node3 = node1.children[0];
            node3.content = "3";

            const node2 = node1.children[1];
            node2.content = "2";

            treeNodeStore.split(node3, SplitType.Horizontal);
            treeNodeStore.split(node3, SplitType.Vertical);

            const node5 = node3.children[0];
            node5.content = "5";

            const node4 = node3.children[1];
            node4.content = "4";

            treeNodeStore.split(node2, SplitType.Horizontal);
            treeNodeStore.split(node2, SplitType.Horizontal);

            const node6 = node2.children[0];
            node6.content = "6";

            const node8 = node2.children[1];
            node8.content = "8";

            treeNodeStore.split(node6, SplitType.Vertical);

            const node7 = node6.children[0];
            node7.content = "7";

            const expectedResults: { key: TreeNode, x: number, y: number }[] = [];

            expectedResults.push({
                key: node1,
                x: 0,
                y: 0
            });
            expectedResults.push({
                key: node2,
                x: 2,
                y: 0
            });
            expectedResults.push({
                key: node3,
                x: 4,
                y: 0
            });
            expectedResults.push({
                key: node4,
                x: 6,
                y: 0
            });
            expectedResults.push({
                key: node5,
                x: 4,
                y: 2
            });
            expectedResults.push({
                key: node6,
                x: 2,
                y: 2
            });
            expectedResults.push({
                key: node7,
                x: 3,
                y: 2
            });
            expectedResults.push({
                key: node8,
                x: 2,
                y: 1
            });

            treeNodeStore.nodes.forEach(n => {
                const x = sut.getIndex(n, SplitType.Vertical);
                const y = sut.getIndex(n, SplitType.Horizontal);

                const expected = expectedResults.filter(r => r.key === n)[0];

                console.log(`Node content: '${n.content}', x: ${x}, y: ${y}'`);

                expect(x).toBe(expected.x);
                expect(y).toBe(expected.y);
            });
        });
    });
});