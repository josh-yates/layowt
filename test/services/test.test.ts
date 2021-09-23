import { SplitType } from '../../src/models/splitType';
import type { TreeNode } from '../../src/models/treeNode';
import { GridService } from '../../src/services/gridService';
import { TreeNodeStore } from '../../src/services/treeNodeStore';

let treeNodeStore: TreeNodeStore;
let sut: GridService;

let node1: TreeNode;
let node2: TreeNode;
let node3: TreeNode;
let node4: TreeNode;

function setupScenario1(): void {
    node1 = treeNodeStore.nodes[0];
    node1.content = "1";

    treeNodeStore.split(node1, SplitType.Vertical);

    node2 = node1.children[0];
    node2.content = "2";

    treeNodeStore.split(node1, SplitType.Horizontal);
    node3 = node1.children[1];
    node3.content = "3";

    treeNodeStore.split(node3, SplitType.Vertical);

    node4 = node3.children[0];
    node4.content = "4";
};

beforeEach(() => {
    treeNodeStore = new TreeNodeStore();
    sut = new GridService(treeNodeStore);
    setupScenario1();
});

describe('GridService', () => {
    describe('getGridColumns', () => {
        it('Gets the column count correctly', () => {
            expect(sut.getGridColumns()).toBe(4);
        });
    });
    describe('getGridRows', () => {
        it('Gets the row count correctly', () => {
            expect(sut.getGridRows()).toBe(2);
        });
    });
    describe('getIndex', () => {
        it('Calculates index correctly', () => {
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
                x: 0,
                y: 1
            });
            expectedResults.push({
                key: node4,
                x: 1,
                y: 1
            });

            treeNodeStore.nodes.forEach(n => {
                const x = sut.getIndex(n, SplitType.Vertical);
                const y = sut.getIndex(n, SplitType.Horizontal);

                const expected = expectedResults.filter(r => r.key === n)[0];

                expect(x).toBe(expected.x);
                expect(y).toBe(expected.y);
            });
        });
    });
    describe('getSpan', () => {
        it('Calculates span correctly', () => {
            const expectedResults: { key: TreeNode, cols: number, rows: number }[] = [];

            expectedResults.push({
                key: node1,
                cols: 2,
                rows: 1
            });
            expectedResults.push({
                key: node2,
                cols: 2,
                rows: 2
            });
            expectedResults.push({
                key: node3,
                cols: 1,
                rows: 1
            });
            expectedResults.push({
                key: node4,
                cols: 1,
                rows: 1
            });

            treeNodeStore.nodes.forEach(n => {
                const cols = sut.getSpan(n, SplitType.Vertical);
                const rows = sut.getSpan(n, SplitType.Horizontal);

                const expected = expectedResults.filter(r => r.key === n)[0];

                expect(cols).toBe(expected.cols);
                expect(rows).toBe(expected.rows);
            });
        });
    });
});