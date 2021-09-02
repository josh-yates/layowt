import { GridService } from '../../src/services/gridService';
import { TreeNodeStore } from '../../src/services/treeNodeStore';

let treeNodeStore: TreeNodeStore;
let sut: GridService;

beforeEach(() => {
    treeNodeStore = new TreeNodeStore();
    sut = new GridService(treeNodeStore);
});

describe('GridService', () => {
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
        });
    });
});