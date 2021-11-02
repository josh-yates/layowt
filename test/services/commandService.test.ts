import { SplitType } from '../../src/models/splitType';
import type { Pane } from '../../src/models/pane';
import { CommandService } from '../../src/services/commandService';
import { PaneService } from '../../src/services/paneService';
import { TabService } from '../../src/services/tabService';
import { Layout } from '../../src/models/layout';

let paneService: PaneService;
let sut: CommandService;
let tabService: TabService;

let layout: Layout;

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
    //   | X | Y | R | C
    // 1 | 0 | 0 | 2 | 4
    // 2 | 2 | 0 | 2 | 1
    // 3 | 4 | 0 | 2 | 2
    // 4 | 6 | 0 | 2 | 2
    // 5 | 4 | 2 | 4 | 2
    // 6 | 2 | 2 | 1 | 2
    // 7 | 3 | 2 | 1 | 2
    // 8 | 2 | 1 | 2 | 1

    node1 = layout.tabs[0].panes[0];
    node1.content = "Write-Host 1";

    paneService.split(node1, SplitType.Vertical);
    paneService.split(node1, SplitType.Vertical);

    node3 = node1.children[0];
    node3.content = "Write-Host 3";

    node2 = node1.children[1];
    node2.content = "Write-Host 2";

    paneService.split(node3, SplitType.Horizontal);
    paneService.split(node3, SplitType.Vertical);

    node5 = node3.children[0];
    node5.content = "Write-Host 5";

    node4 = node3.children[1];
    node4.content = "Write-Host 4";

    paneService.split(node2, SplitType.Horizontal);
    paneService.split(node2, SplitType.Horizontal);

    node6 = node2.children[0];
    node6.content = "Write-Host 6";

    node8 = node2.children[1];
    node8.content = "Write-Host 8";

    paneService.split(node6, SplitType.Vertical);

    node7 = node6.children[0];
    node7.content = "Write-Host 7";
};

function setupScenario2(): void {
    // Tab 1
    // wt powershell -NoExit "Tab1Pane1" `; sp -V powershell -NoExit "Tab1Pane2" `; sp -H powershell -NoExit "Tab1Pane3" `; mf up `; mf left
    // -------
    // |1 |2 |
    // |  |--|
    // |  |3 |
    // -------
    const tab1 = layout.tabs[0];

    const tab1Pane1 = tab1.panes[0];
    paneService.split(tab1Pane1, SplitType.Vertical);

    const tab1Pane2 = tab1Pane1.children[0];
    paneService.split(tab1Pane2, SplitType.Horizontal);

    const tab1Pane3 = tab1Pane2.children[0];

    tab1Pane1.content = 'Tab1Pane1';
    tab1Pane2.content = 'Tab1Pane2';
    tab1Pane3.content = 'Tab1Pane3';

    // Tab 2
    // wt powershell -NoExit "Tab2Pane1" `; sp -V powershell -NoExit "Tab2Pane2" `; mf left `; sp -H powershell -NoExit "Tab2Pane3" `; mf up
    // -------
    // |1 |2 |
    // |--|  |
    // |3 |  |
    // -------
    tabService.add(layout);
    const tab2 = layout.tabs[1];

    const tab2Pane1 = tab2.panes[0];
    paneService.split(tab2Pane1, SplitType.Vertical);

    const tab2Pane2 = tab2Pane1.children[0];

    paneService.split(tab2Pane1, SplitType.Horizontal);

    const tab2Pane3 = tab2Pane1.children[1];

    tab2Pane1.content = 'Tab2Pane1';
    tab2Pane2.content = 'Tab2Pane2';
    tab2Pane3.content = 'Tab2Pane3';

    // Tab 3
    // wt powershell -NoExit "Tab3Pane1"
    // -------
    // |1    |
    // |     |
    // |     |
    // -------
    tabService.add(layout);
    const tab3 = layout.tabs[2];

    const tab3pane1 = tab3.panes[0];

    tab3pane1.content = 'Tab3Pane1';
}

beforeEach(() => {
    paneService = new PaneService();
    tabService = new TabService();

    layout = new Layout();

    sut = new CommandService(paneService);
});

describe('CommandService', () => {
    describe('getCommand', () => {
        it('Gets the command correctly', () => {
            setupScenario1();
            expect(sut.getCommand(layout)).toBe('wt powershell -NoExit "Write-Host 1" `; sp -V powershell -NoExit "Write-Host 3" `; sp -H powershell -NoExit "Write-Host 5" `; mf up `; sp -V powershell -NoExit "Write-Host 4" `; mf left `; mf left `; sp -V powershell -NoExit "Write-Host 2" `; sp -H powershell -NoExit "Write-Host 6" `; sp -V powershell -NoExit "Write-Host 7" `; mf left `; mf up `; sp -H powershell -NoExit "Write-Host 8" `; mf up `; mf left');
        });

        it('Does not generate a pane command when pane has no content', () => {
            paneService.split(paneService.getRootNode(layout.tabs[0]), SplitType.Vertical);
            expect(sut.getCommand(layout)).toBe('wt `; sp -V `; mf left');
        });

        it('Supports multiple tabs', () => {
            setupScenario2();
            expect(sut.getCommand(layout)).toBe('wt powershell -NoExit "Tab1Pane1" `; sp -V powershell -NoExit "Tab1Pane2" `; sp -H powershell -NoExit "Tab1Pane3" `; mf up `; mf left `; new-tab powershell -NoExit "Tab2Pane1" `; sp -V powershell -NoExit "Tab2Pane2" `; mf left `; sp -H powershell -NoExit "Tab2Pane3" `; mf up `; new-tab powershell -NoExit "Tab3Pane1" `; ft -t 0');
        })
    });
});