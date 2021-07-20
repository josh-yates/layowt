import { SplitType } from '../models/splitType';
import type { TreeNode } from '../models/treeNode';
import type { PaneService } from './paneService';
import { TreeNodeService } from './treeNodeService';

export class GridService {
    constructor(private readonly _paneService: PaneService) { }

    public getGridStylesForPane(pane: TreeNode): string {
        const columnCount = this.gridColumns;
        const rowCount = this.gridRows;

        return `
            grid-column: ${TreeNodeService.getIndex(columnCount, pane, SplitType.Vertical)};
            grid-row: ${TreeNodeService.getIndex(rowCount, pane, SplitType.Horizontal)};
        `;
    }

    public get gridColumns(): number {
        return this._paneService.panes.sort((a, b) => b.rightDepth - a.rightDepth)[0].rightDepth;
    }

    public get gridRows(): number {
        return this._paneService.panes.sort((a, b) => b.downDepth - a.downDepth)[0].downDepth;
    }
}