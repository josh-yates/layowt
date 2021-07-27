import { SplitType } from '../models/splitType';
import type { TreeNode } from '../models/treeNode';
import type { PaneService } from './paneService';
import { TreeNodeService } from './treeNodeService';

export class GridService {
    constructor(private readonly _paneService: PaneService) { }

    public getGridStylesForPane(pane: TreeNode, update: any): string {
        const columnCount = this.gridColumns;
        const rowCount = this.gridRows;

        const columnSpan = columnCount / Math.pow(2, pane.verticalSplits);
        const rowSpan = rowCount / Math.pow(2, pane.horizontalSplits);

        return `
            grid-column: ${this.getIndex(pane, SplitType.Vertical)} / span ${columnSpan};
            grid-row: ${this.getIndex(pane, SplitType.Horizontal)} / span ${rowSpan};
        `;
    }

    public getGridStylesForContainer(update: any): string {
        return `
            grid-template-columns: repeat(${this.gridColumns}, 1fr);
            grid-template-rows: repeat(${this.gridRows}, 1fr);
        `;
    }

    public get gridColumns(): number {
        return Math.pow(2, this._paneService.panes.sort((a, b) => b.verticalSplits - a.verticalSplits)[0].verticalSplits);
    }

    public get gridRows(): number {
        return Math.pow(2, this._paneService.panes.sort((a, b) => b.horizontalSplits - a.horizontalSplits)[0].horizontalSplits);
    }

    public getIndex(pane: TreeNode, splitType: SplitType): number {
        console.log(pane);
        let index = 1;
        const totalCount = splitType === SplitType.Vertical ? this.gridColumns : this.gridRows;

        let currentPane = pane;

        while (currentPane.parent) {
            if (currentPane.parent.split === splitType && currentPane === currentPane.parent.child2) {
                index += totalCount / Math.pow(2, splitType === SplitType.Vertical ? currentPane.verticalSplits : currentPane.horizontalSplits);
            }

            currentPane = currentPane.parent;
        }

        return index;
    }
}