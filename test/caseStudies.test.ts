import { Layout } from "../src/models/layout";
import { SplitType } from "../src/models/splitType";
import { CloningService } from "../src/services/cloningService";
import { CommandService } from "../src/services/commandService";
import { GridService } from "../src/services/gridService";
import { PaneService } from "../src/services/paneService";
import { PercentageLayoutService } from "../src/services/percentageLayoutService";
import { UIService } from "../src/services/uiService";

describe('Case studies', () => {
    it('Should support splitting horizontally then removing first node', () => {
        const cloningService = new CloningService();
        const paneService = new PaneService(cloningService);
        const gridService = new GridService(paneService);
        const percentageLayoutService = new PercentageLayoutService();
        const commandService = new CommandService(paneService);
        const uiService = new UIService(gridService, percentageLayoutService, commandService);

        const layout = new Layout();

        const tab = layout.tabs[0];

        const firstNode = tab.panes[0];

        paneService.split(firstNode, SplitType.Horizontal);

        const secondNode = firstNode.children[0];

        paneService.remove(firstNode);

        expect(uiService.getCommandText(layout, null).trim()).toBe('wt');
        expect(uiService.getContainerGridStyles(tab, null)).toBe('grid-template-columns: repeat(1, 1fr); grid-template-rows: repeat(1, 1fr);');
        expect(uiService.getPaneGridStyles(secondNode, null)).toBe('grid-column: 1 / span 1; grid-row: 1 / span 1;');
    });

    it('Should support splitting horizontally then removing first node, with text', () => {
        const cloningService = new CloningService();
        const paneService = new PaneService(cloningService);
        const gridService = new GridService(paneService);
        const percentageLayoutService = new PercentageLayoutService();
        const commandService = new CommandService(paneService);
        const uiService = new UIService(gridService, percentageLayoutService, commandService);

        const layout = new Layout();

        const tab = layout.tabs[0];

        const firstNode = tab.panes[0];

        firstNode.content = 'First content';

        paneService.split(firstNode, SplitType.Horizontal);

        const secondNode = firstNode.children[0];
        secondNode.content = 'Second content';

        paneService.remove(firstNode);

        expect(uiService.getCommandText(layout, null).trim()).toBe('wt powershell -NoExit "Second content"');
        expect(uiService.getContainerGridStyles(tab, null)).toBe('grid-template-columns: repeat(1, 1fr); grid-template-rows: repeat(1, 1fr);');
        expect(uiService.getPaneGridStyles(secondNode, null)).toBe('grid-column: 1 / span 1; grid-row: 1 / span 1;');
    });

    it('[#11] Should support splitting vertically then removing second node, with text', () => {
        const cloningService = new CloningService();
        const paneService = new PaneService(cloningService);
        const gridService = new GridService(paneService);
        const percentageLayoutService = new PercentageLayoutService();
        const commandService = new CommandService(paneService);
        const uiService = new UIService(gridService, percentageLayoutService, commandService);

        const layout = new Layout();

        const tab = layout.tabs[0];

        const firstNode = tab.panes[0];

        firstNode.content = 'First content';

        paneService.split(firstNode, SplitType.Horizontal);

        const secondNode = firstNode.children[0];
        secondNode.content = 'Second content';

        paneService.remove(secondNode);

        expect(uiService.getCommandText(layout, null).trim()).toBe('wt powershell -NoExit "First content"');
        expect(uiService.getContainerGridStyles(tab, null)).toBe('grid-template-columns: repeat(1, 1fr); grid-template-rows: repeat(1, 1fr);');
        expect(uiService.getPaneGridStyles(firstNode, null)).toBe('grid-column: 1 / span 1; grid-row: 1 / span 1;');
    });

    it('[#11] Should support splitting vertically then horizontally, then removing top-right pane', () => {
        const cloningService = new CloningService();
        const paneService = new PaneService(cloningService);
        const gridService = new GridService(paneService);
        const percentageLayoutService = new PercentageLayoutService();
        const commandService = new CommandService(paneService);
        const uiService = new UIService(gridService, percentageLayoutService, commandService);

        const layout = new Layout();

        const tab = layout.tabs[0];

        const firstNode = tab.panes[0];

        firstNode.content = 'First content';

        paneService.split(firstNode, SplitType.Vertical);

        const secondNode = firstNode.children[0];

        secondNode.content = 'Second content';

        paneService.split(secondNode, SplitType.Horizontal);

        const thirdNode = secondNode.children[0];

        thirdNode.content = 'Third content';

        paneService.remove(secondNode);

        expect(uiService.getCommandText(layout, null).trim()).toBe('wt powershell -NoExit "First content" `; sp -V powershell -NoExit "Third content" `; mf left');
        expect(uiService.getContainerGridStyles(tab, null)).toBe('grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(1, 1fr);');
        expect(uiService.getPaneGridStyles(firstNode, null)).toBe('grid-column: 1 / span 1; grid-row: 1 / span 1;');
        expect(uiService.getPaneGridStyles(thirdNode, null)).toBe('grid-column: 2 / span 1; grid-row: 1 / span 1;');
    });
    it('Should support basic splitting with percentage layout', () => {
        const cloningService = new CloningService();
        const paneService = new PaneService(cloningService);
        const gridService = new GridService(paneService);
        const percentageLayoutService = new PercentageLayoutService();
        const commandService = new CommandService(paneService);
        const uiService = new UIService(gridService, percentageLayoutService, commandService);

        const layout = new Layout();

        const tab = layout.tabs[0];

        const firstNode = tab.panes[0];

        paneService.split(firstNode, SplitType.Vertical);

        const secondNode = firstNode.children[0];

        paneService.split(secondNode, SplitType.Vertical);

        const thirdNode = secondNode.children[0];

        expect(uiService.getPanePositionStyles(firstNode, null)).toBe('position: absolute; top: 0%; left: 0%; height: 100%; width: 50%;');
        expect(uiService.getPanePositionStyles(secondNode, null)).toBe('position: absolute; top: 0%; left: 50%; height: 100%; width: 25%;');
        expect(uiService.getPanePositionStyles(thirdNode, null)).toBe('position: absolute; top: 0%; left: 75%; height: 100%; width: 25%;');
    });
    it('Should support basic splitting with percentage layout - second pane has percentage', () => {
        const cloningService = new CloningService();
        const paneService = new PaneService(cloningService);
        const gridService = new GridService(paneService);
        const percentageLayoutService = new PercentageLayoutService();
        const commandService = new CommandService(paneService);
        const uiService = new UIService(gridService, percentageLayoutService, commandService);

        const layout = new Layout();

        const tab = layout.tabs[0];

        const firstNode = tab.panes[0];

        paneService.split(firstNode, SplitType.Vertical);

        const secondNode = firstNode.children[0];

        paneService.split(secondNode, SplitType.Vertical);

        const thirdNode = secondNode.children[0];

        secondNode.size = 60;

        expect(uiService.getPanePositionStyles(firstNode, null)).toBe('position: absolute; top: 0%; left: 0%; height: 100%; width: 40%;');
        expect(uiService.getPanePositionStyles(secondNode, null)).toBe('position: absolute; top: 0%; left: 40%; height: 100%; width: 30%;');
        expect(uiService.getPanePositionStyles(thirdNode, null)).toBe('position: absolute; top: 0%; left: 70%; height: 100%; width: 30%;');
    });
});