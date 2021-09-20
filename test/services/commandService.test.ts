import { SplitType } from '../../src/models/splitType';
import type { TreeNode } from '../../src/models/treeNode';
import { CommandService } from '../../src/services/commandService';
import { TreeNodeStore } from '../../src/services/treeNodeStore';

let treeNodeStore: TreeNodeStore;
let sut: CommandService;

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

    // TODO: add commands here
    node1 = treeNodeStore.nodes[0];
    node1.content = "Write-Host 1";

    treeNodeStore.split(node1, SplitType.Vertical);
    treeNodeStore.split(node1, SplitType.Vertical);

    node3 = node1.children[0];
    node3.content = "Write-Host 3";

    node2 = node1.children[1];
    node2.content = "Write-Host 2";

    treeNodeStore.split(node3, SplitType.Horizontal);
    treeNodeStore.split(node3, SplitType.Vertical);

    node5 = node3.children[0];
    node5.content = "Write-Host 5";

    node4 = node3.children[1];
    node4.content = "Write-Host 4";

    treeNodeStore.split(node2, SplitType.Horizontal);
    treeNodeStore.split(node2, SplitType.Horizontal);

    node6 = node2.children[0];
    node6.content = "Write-Host 6";

    node8 = node2.children[1];
    node8.content = "Write-Host 8";

    treeNodeStore.split(node6, SplitType.Vertical);

    node7 = node6.children[0];
    node7.content = "Write-Host 7";
};

beforeEach(() => {
    treeNodeStore = new TreeNodeStore();
    sut = new CommandService(treeNodeStore);
    setupScenario1();
});

describe('CommandService', () => {
    describe('getCommand', () => {
        it('Gets the command correctly', () => {
            expect(sut.getCommand()).toBe('wt powershell -NoExit "Write-Host 1" `; sp -V powershell -NoExit "Write-Host 3" `; sp -H powershell -NoExit "Write-Host 5" `; mf up `; sp -V  powershell -NoExit "Write-Host 4" `; mf left `; mf left `; sp -V  powershell -NoExit "Write-Host 2" `; sp -H  powershell -NoExit "Write-Host 6" `; sp -V  powershell -NoExit "Write-Host 7" `; mf left `; mf up `; sp -H  powershell -NoExit "Write-Host 8" `; mf up `; mf left');
        });
    });
});