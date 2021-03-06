import { SplitType } from "../../src/models/splitType";
import { Tab } from "../../src/models/tab";
import type { Pane } from "../../src/models/pane";
import { CommandService } from "../../src/services/commandService";
import { GridService } from "../../src/services/gridService";
import { PaneService } from "../../src/services/paneService";
import { UIService } from "../../src/services/uiService";
import { Layout } from "../../src/models/layout";
import { CloningService } from "../../src/services/cloningService";

let cloningService: CloningService;
let paneService: PaneService;
let commandService: CommandService;
let gridService: GridService;
let sut: UIService;

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

beforeEach(() => {
    cloningService = new CloningService();
    paneService = new PaneService(cloningService);
    gridService = new GridService(paneService);
    commandService = new CommandService(paneService);

    layout = new Layout();

    sut = new UIService(gridService, commandService);

    setupScenario1();
});

describe('UIService', () => {
    describe('getContainerGridStyles', () => {
        it('Gets the container grid styles correctly', () => {
            expect(sut.getContainerGridStyles(layout.tabs[0], {})).toBe('grid-template-columns: repeat(8, 1fr); grid-template-rows: repeat(4, 1fr);');
        });
    });
    describe('getPaneGridStyles', () => {
        it('Gets the grid styles for panes correctly', () => {
            const expectedResults: { key: Pane, styles: string }[] = [];

            expectedResults.push({
                key: node1,
                styles: 'grid-column: 1 / span 2; grid-row: 1 / span 4;'
            });
            expectedResults.push({
                key: node2,
                styles: 'grid-column: 3 / span 2; grid-row: 1 / span 1;'
            });
            expectedResults.push({
                key: node3,
                styles: 'grid-column: 5 / span 2; grid-row: 1 / span 2;'
            });
            expectedResults.push({
                key: node4,
                styles: 'grid-column: 7 / span 2; grid-row: 1 / span 2;'
            });
            expectedResults.push({
                key: node5,
                styles: 'grid-column: 5 / span 4; grid-row: 3 / span 2;'
            });
            expectedResults.push({
                key: node6,
                styles: 'grid-column: 3 / span 1; grid-row: 3 / span 2;'
            });
            expectedResults.push({
                key: node7,
                styles: 'grid-column: 4 / span 1; grid-row: 3 / span 2;'
            });
            expectedResults.push({
                key: node8,
                styles: 'grid-column: 3 / span 2; grid-row: 2 / span 1;'
            });

            layout.tabs[0].panes.forEach(n => {
                const style = sut.getPaneGridStyles(n, {});

                const expected = expectedResults.filter(r => r.key === n)[0];

                expect(style).toEqual(expected.styles);
            });
        });
    });
});