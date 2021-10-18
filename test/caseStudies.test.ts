import { SplitType } from "../src/models/splitType";
import { CommandService } from "../src/services/commandService";
import { GridService } from "../src/services/gridService";
import { TreeNodeStore } from "../src/services/treeNodeStore";
import { UIService } from "../src/services/uiService";

describe('Case studies', () => {
    it('Should support splitting horizontally then removing first node', () => {
        const treeNodeStore = new TreeNodeStore();
        const gridService = new GridService(treeNodeStore);
        const commandService = new CommandService(treeNodeStore);
        const uiService = new UIService(gridService, commandService);

        const firstNode = treeNodeStore.nodes[0];

        treeNodeStore.split(firstNode, SplitType.Horizontal);

        const secondNode = firstNode.children[0];

        treeNodeStore.remove(firstNode);

        expect(uiService.getCommandText(null).trim()).toBe('wt');
        expect(uiService.getContainerGridStyles(null)).toBe('grid-template-columns: repeat(1, 1fr); grid-template-rows: repeat(1, 1fr);');
        expect(uiService.getPaneGridStyles(secondNode, null)).toBe('grid-column: 1 / span 1; grid-row: 1 / span 1;');
    });

    it('Should support splitting horizontally then removing first node, with text', () => {
        const treeNodeStore = new TreeNodeStore();
        const gridService = new GridService(treeNodeStore);
        const commandService = new CommandService(treeNodeStore);
        const uiService = new UIService(gridService, commandService);

        const firstNode = treeNodeStore.nodes[0];
        firstNode.content = 'First content';

        treeNodeStore.split(firstNode, SplitType.Horizontal);

        const secondNode = firstNode.children[0];
        secondNode.content = 'Second content';

        treeNodeStore.remove(firstNode);

        expect(uiService.getCommandText(null).trim()).toBe('wt powershell -NoExit "Second content"');
        expect(uiService.getContainerGridStyles(null)).toBe('grid-template-columns: repeat(1, 1fr); grid-template-rows: repeat(1, 1fr);');
        expect(uiService.getPaneGridStyles(secondNode, null)).toBe('grid-column: 1 / span 1; grid-row: 1 / span 1;');
    });
});