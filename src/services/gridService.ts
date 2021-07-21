import { SplitType } from '../models/splitType';
import type { TreeNode } from '../models/treeNode';
import type { PaneService } from './paneService';
import { TreeNodeService } from './treeNodeService';

export class GridService {
    constructor(private readonly _paneService: PaneService) { }

    public getGridStylesForPane(pane: TreeNode): string {
        const columnCount = this.gridColumns;
        const rowCount = this.gridRows;

        const columnSpan = columnCount / Math.pow(2, pane.rightDepth);
        const rowSpan = rowCount / Math.pow(2, pane.downDepth);
        
        return `
            grid-column: ${TreeNodeService.getIndex(columnCount, pane, SplitType.Vertical)} / span ${columnSpan};
            grid-row: ${TreeNodeService.getIndex(rowCount, pane, SplitType.Horizontal)} / span ${rowSpan};
        `;
    }

    public get gridColumns(): number {
        return Math.pow(2, this._paneService.panes.sort((a, b) => b.verticalSplits - a.verticalSplits)[0].verticalSplits);
    }

    public get gridRows(): number {
        return Math.pow(2, this._paneService.panes.sort((a, b) => b.horizontalSplits - a.horizontalSplits)[0].horizontalSplits);
    }
}