import { Layout } from '../../src/models/layout';
import type { Pane } from '../../src/models/pane';
import { SplitType } from '../../src/models/splitType';
import type { Tab } from '../../src/models/tab';
import { CloningService } from '../../src/services/cloningService';
import { PaneService } from '../../src/services/paneService';
import { TabService } from '../../src/services/tabService';

let sut: CloningService;
let paneService: PaneService;
let tabService: TabService;

let layout: Layout;

let tab1: Tab;

let tab1pane1: Pane;
let tab1pane2: Pane;
let tab1pane3: Pane;

let tab2: Tab;

let tab2pane1: Pane;
let tab2pane2: Pane;
let tab2pane3: Pane;

function setupScenario1(): void {
    // Two tabs, 3 panes in first tab, 3 panes in second tab
    // First tab vertical then horizontal split
    // Second tab horizontal split then vertical split on first pane

    layout = new Layout();

    layout.title = 'Layowt';

    tab1 = layout.tabs[0];

    tab1pane1 = tab1.panes[0];

    paneService.split(tab1pane1, SplitType.Vertical);

    tab1pane2 = tab1pane1.children[0];

    paneService.split(tab1pane2, SplitType.Horizontal);

    tab1pane3 = tab1pane2.children[0];

    tab1pane1.content = 'Tab 1 pane 1';
    tab1pane1.directory = 'Tab 1 pane 1 directory';
    tab1pane1.colourScheme = 'Tab 1 pane 1 colour scheme';
    tab1pane1.cloneOnSplit = true;
    tab1pane1.persistTitle = false;

    tab1pane2.content = 'Tab 1 pane 2';
    tab1pane3.content = 'Tab 1 pane 3';

    tabService.add(layout);

    tab2 = layout.tabs[1];

    tab2pane1 = tab2.panes[0];

    paneService.split(tab2pane1, SplitType.Horizontal);

    tab2pane2 = tab2pane1.children[0];

    paneService.split(tab2pane1, SplitType.Vertical);

    tab2pane3 = tab2pane1.children[1];

    tab2pane1.content = 'Tab 2 pane 1';
    tab2pane2.content = 'Tab 2 pane 2';
    tab2pane3.content = 'Tab 2 pane 3';
};

beforeEach(() => {
    sut = new CloningService();

    paneService = new PaneService(sut);
    tabService = new TabService();

    setupScenario1();
});

describe('CloningService', () => {
    describe('cloneLayout', () => {
        it('Exactly clones a layout', () => {
            const clonedLayout = sut.cloneLayout(layout);

            const clonedTab1 = clonedLayout.tabs[0];
            const clonedTab1pane1 = clonedTab1.panes[0];
            const clonedTab1pane2 = clonedTab1pane1.children[0];
            const clonedTab1pane3 = clonedTab1pane2.children[0];

            const clonedTab2 = clonedLayout.tabs[1];
            const clonedTab2pane1 = clonedTab2.panes[0];
            const clonedTab2pane2 = clonedTab2pane1.children[0];
            const clonedTab2pane3 = clonedTab2pane1.children[1];

            // Ensure all new objects
            expect(clonedLayout).not.toBe(layout);
            expect(clonedTab1).not.toBe(tab1);
            expect(clonedTab1pane1).not.toBe(tab1pane1);
            expect(clonedTab1pane2).not.toBe(tab1pane2);
            expect(clonedTab1pane3).not.toBe(tab1pane3);
            expect(clonedTab2).not.toBe(tab2);
            expect(clonedTab2pane1).not.toBe(tab2pane1);
            expect(clonedTab2pane2).not.toBe(tab2pane2);
            expect(clonedTab2pane3).not.toBe(tab2pane3);

            // Check relationships
            expect(clonedTab1.layout).toBe(clonedLayout);
            expect(clonedTab2.layout).toBe(clonedLayout);
            expect(clonedTab1pane1.tab).toBe(clonedTab1);
            expect(clonedTab1pane2.tab).toBe(clonedTab1);
            expect(clonedTab1pane3.tab).toBe(clonedTab1);
            expect(clonedTab1pane1.parent).toBeNull();
            expect(clonedTab1pane2.parent).toBe(clonedTab1pane1);
            expect(clonedTab1pane3.parent).toBe(clonedTab1pane2);
            expect(clonedTab1pane1.parentSplit === null || clonedTab1pane1.parentSplit === undefined).toBe(true);
            expect(clonedTab1pane2.parentSplit).toBe(SplitType.Vertical);
            expect(clonedTab1pane3.parentSplit).toBe(SplitType.Horizontal);
            expect(clonedTab2pane1.tab).toBe(clonedTab2);
            expect(clonedTab2pane2.tab).toBe(clonedTab2);
            expect(clonedTab2pane3.tab).toBe(clonedTab2);
            expect(clonedTab2pane1.parent).toBeNull();
            expect(clonedTab2pane2.parent).toBe(clonedTab2pane1);
            expect(clonedTab2pane3.parent).toBe(clonedTab2pane1);
            expect(clonedTab2pane1.parentSplit === null || clonedTab2pane1.parentSplit === undefined).toBe(true);
            expect(clonedTab2pane2.parentSplit).toBe(SplitType.Horizontal);
            expect(clonedTab2pane3.parentSplit).toBe(SplitType.Vertical);

            // Check content
            expect(clonedLayout.title).toBe('Layowt (clone)');
            expect(clonedTab1pane1.content).toBe('Tab 1 pane 1');
            expect(clonedTab1pane2.content).toBe('Tab 1 pane 2');
            expect(clonedTab1pane3.content).toBe('Tab 1 pane 3');
            expect(clonedTab2pane1.content).toBe('Tab 2 pane 1');
            expect(clonedTab2pane2.content).toBe('Tab 2 pane 2');
            expect(clonedTab2pane3.content).toBe('Tab 2 pane 3');

            // Check settings
            expect(clonedTab1pane1.directory).toBe('Tab 1 pane 1 directory')
            expect(clonedTab1pane1.colourScheme).toBe('Tab 1 pane 1 colour scheme');
            expect(clonedTab1pane1.cloneOnSplit).toBe(true);
            expect(clonedTab1pane1.persistTitle).toBe(false);
        });
    });
    describe('cloneTab', () => {
        it('Exactly clones a tab', () => {
            const clonedTab1 = sut.cloneTab(tab1);

            const clonedTab1pane1 = clonedTab1.panes[0];
            const clonedTab1pane2 = clonedTab1pane1.children[0];
            const clonedTab1pane3 = clonedTab1pane2.children[0];

            // Ensure all new objects
            expect(clonedTab1).not.toBe(tab1);
            expect(clonedTab1pane1).not.toBe(tab1pane1);
            expect(clonedTab1pane2).not.toBe(tab1pane2);
            expect(clonedTab1pane3).not.toBe(tab1pane3);

            // Check relationships
            expect(clonedTab1.layout).toBe(layout);
            expect(clonedTab1pane1.tab).toBe(clonedTab1);
            expect(clonedTab1pane2.tab).toBe(clonedTab1);
            expect(clonedTab1pane3.tab).toBe(clonedTab1);
            expect(clonedTab1pane1.parent).toBeNull();
            expect(clonedTab1pane2.parent).toBe(clonedTab1pane1);
            expect(clonedTab1pane3.parent).toBe(clonedTab1pane2);
            expect(clonedTab1pane1.parentSplit === null || clonedTab1pane1.parentSplit === undefined).toBe(true);
            expect(clonedTab1pane2.parentSplit).toBe(SplitType.Vertical);
            expect(clonedTab1pane3.parentSplit).toBe(SplitType.Horizontal);

            // Check content
            expect(clonedTab1pane1.content).toBe('Tab 1 pane 1');
            expect(clonedTab1pane2.content).toBe('Tab 1 pane 2');
            expect(clonedTab1pane3.content).toBe('Tab 1 pane 3');

            // Check settings
            expect(clonedTab1pane1.directory).toBe('Tab 1 pane 1 directory')
            expect(clonedTab1pane1.colourScheme).toBe('Tab 1 pane 1 colour scheme');
            expect(clonedTab1pane1.cloneOnSplit).toBe(true);
            expect(clonedTab1pane1.persistTitle).toBe(false);
        });
    });
    describe('clonePane', () => {
        it('Exactly clones a pane', () => {
            const clonedPane = sut.clonePane(tab1pane1);

            // Ensure new object
            expect(clonedPane).not.toBe(tab1pane1);

            // Check relationship
            expect(clonedPane.tab).toBe(tab1);

            // Check content
            expect(clonedPane.content).toBe('Tab 1 pane 1');

            // Check settings
            expect(clonedPane.directory).toBe('Tab 1 pane 1 directory')
            expect(clonedPane.colourScheme).toBe('Tab 1 pane 1 colour scheme');
            expect(clonedPane.cloneOnSplit).toBe(true);
            expect(clonedPane.persistTitle).toBe(false);
        });
    });
});