import { SplitType } from '../../src/models/splitType';
import { Tab } from '../../src/models/tab';
import type { TreeNode } from '../../src/models/treeNode';
import { GridService } from '../../src/services/gridService';
import { TreeNodeService } from '../../src/services/treeNodeService';

let treeNodeService: TreeNodeService;
let sut: GridService;

let tab: Tab;

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
    //   | X | Y | R | C
    // 1 | 0 | 0 | 2 | 4
    // 2 | 2 | 0 | 2 | 1
    // 3 | 4 | 0 | 2 | 2
    // 4 | 6 | 0 | 2 | 2
    // 5 | 4 | 2 | 4 | 2
    // 6 | 2 | 2 | 1 | 2
    // 7 | 3 | 2 | 1 | 2
    // 8 | 2 | 1 | 2 | 1

    node1 = tab.panes[0];
    node1.content = "1";

    treeNodeService.split(node1, SplitType.Vertical);
    treeNodeService.split(node1, SplitType.Vertical);

    node3 = node1.children[0];
    node3.content = "3";

    node2 = node1.children[1];
    node2.content = "2";

    treeNodeService.split(node3, SplitType.Horizontal);
    treeNodeService.split(node3, SplitType.Vertical);

    node5 = node3.children[0];
    node5.content = "5";

    node4 = node3.children[1];
    node4.content = "4";

    treeNodeService.split(node2, SplitType.Horizontal);
    treeNodeService.split(node2, SplitType.Horizontal);

    node6 = node2.children[0];
    node6.content = "6";

    node8 = node2.children[1];
    node8.content = "8";

    treeNodeService.split(node6, SplitType.Vertical);

    node7 = node6.children[0];
    node7.content = "7";
};

beforeEach(() => {
    treeNodeService = new TreeNodeService();
    sut = new GridService(treeNodeService);

    tab = new Tab();

    setupScenario1();
});

describe('GridService', () => {
    describe('getGridColumns', () => {
        it('Gets the column count correctly', () => {
            expect(sut.getGridColumns(tab)).toBe(8);
        });
    });
    describe('getGridRows', () => {
        it('Gets the row count correctly', () => {
            expect(sut.getGridRows(tab)).toBe(4);
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

            tab.panes.forEach(n => {
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
                rows: 4
            });
            expectedResults.push({
                key: node2,
                cols: 2,
                rows: 1
            });
            expectedResults.push({
                key: node3,
                cols: 2,
                rows: 2
            });
            expectedResults.push({
                key: node4,
                cols: 2,
                rows: 2
            });
            expectedResults.push({
                key: node5,
                cols: 4,
                rows: 2
            });
            expectedResults.push({
                key: node6,
                cols: 1,
                rows: 2
            });
            expectedResults.push({
                key: node7,
                cols: 1,
                rows: 2
            });
            expectedResults.push({
                key: node8,
                cols: 2,
                rows: 1
            });

            tab.panes.forEach(n => {
                const cols = sut.getSpan(n, SplitType.Vertical);
                const rows = sut.getSpan(n, SplitType.Horizontal);

                const expected = expectedResults.filter(r => r.key === n)[0];

                expect(cols).toBe(expected.cols);
                expect(rows).toBe(expected.rows);
            });
        });
    });
});