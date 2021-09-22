import { SplitType } from "../models/splitType";
import type { TreeNode } from "../models/treeNode";
import type { CommandService } from "./commandService";
import type { GridService } from "./gridService";

export class UIService {
    constructor(
        private readonly _gridService: GridService,
        private readonly _commandService: CommandService) { }

    public getContainerGridStyles(update: any): string {
        return `grid-template-columns: repeat(${this._gridService.getGridColumns()}, 1fr); ` +
            `grid-template-rows: repeat(${this._gridService.getGridRows()}, 1fr);`;
    }

    public getPaneGridStyles(pane: TreeNode, update: any): string {
        return `grid-column: ${this._gridService.getIndex(pane, SplitType.Vertical) + 1} / span ${this._gridService.getSpan(pane, SplitType.Vertical)}; ` +
            `grid-row: ${this._gridService.getIndex(pane, SplitType.Horizontal) + 1} / span ${this._gridService.getSpan(pane, SplitType.Horizontal)};`;
    }

    public getCommandText(update: any): string {
        return this._commandService.getCommand();
    }
}