import { SplitType } from "../src/models/splitType";
import { Tab } from "../src/models/tab";
import { CommandService } from "../src/services/commandService";
import { GridService } from "../src/services/gridService";
import { TreeNodeService } from "../src/services/treeNodeService";
import { UIService } from "../src/services/uiService";

describe('Case studies', () => {
    it('Should support splitting horizontally then removing first node', () => {
        const treeNodeService = new TreeNodeService();
        const gridService = new GridService(treeNodeService);
        const commandService = new CommandService(treeNodeService);
        const uiService = new UIService(gridService, commandService);

        const tab = new Tab();

        const firstNode = tab.panes[0];

        treeNodeService.split(firstNode, SplitType.Horizontal);

        const secondNode = firstNode.children[0];

        treeNodeService.remove(firstNode);

        expect(uiService.getCommandText(tab, null).trim()).toBe('wt');
        expect(uiService.getContainerGridStyles(tab, null)).toBe('grid-template-columns: repeat(1, 1fr); grid-template-rows: repeat(1, 1fr);');
        expect(uiService.getPaneGridStyles(secondNode, null)).toBe('grid-column: 1 / span 1; grid-row: 1 / span 1;');
    });

    it('Should support splitting horizontally then removing first node, with text', () => {
        const treeNodeService = new TreeNodeService();
        const gridService = new GridService(treeNodeService);
        const commandService = new CommandService(treeNodeService);
        const uiService = new UIService(gridService, commandService);

        const tab = new Tab();

        const firstNode = tab.panes[0];

        firstNode.content = 'First content';

        treeNodeService.split(firstNode, SplitType.Horizontal);

        const secondNode = firstNode.children[0];
        secondNode.content = 'Second content';

        treeNodeService.remove(firstNode);

        expect(uiService.getCommandText(tab, null).trim()).toBe('wt powershell -NoExit "Second content"');
        expect(uiService.getContainerGridStyles(tab, null)).toBe('grid-template-columns: repeat(1, 1fr); grid-template-rows: repeat(1, 1fr);');
        expect(uiService.getPaneGridStyles(secondNode, null)).toBe('grid-column: 1 / span 1; grid-row: 1 / span 1;');
    });
});