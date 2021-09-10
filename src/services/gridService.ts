import { SplitType } from '../models/splitType';
import type { TreeNode } from '../models/treeNode';
import type { TreeNodeStore } from './treeNodeStore';
import type { TreeService } from './treeService';

export class GridService {
    constructor(
        private readonly _treeNodeStore: TreeNodeStore,
        private readonly _treeService: TreeService) { }

    public getGridColumns(): number {
        const mostVerticalSteps = Math.max(...this._treeNodeStore.nodes.map(n => this._treeService.getStepsTo(n, SplitType.Vertical)));
        return Math.pow(2, mostVerticalSteps);
    }

    public getGridRows(): number {
        const mostHorizontalSteps = Math.max(...this._treeNodeStore.nodes.map(n => this._treeService.getStepsTo(n, SplitType.Horizontal)));
        return Math.pow(2, mostHorizontalSteps);
    }

    public getIndex(node: TreeNode, splitType: SplitType): number {
        return 0;
    }

    public getSpan(node: TreeNode, splitType: SplitType): number {
        const colsOrRowCount = splitType === SplitType.Horizontal ? this.getGridRows() : this.getGridColumns();
        return colsOrRowCount / Math.pow(2, this._treeService.getStepsTo(node, splitType) + node.children.filter(c => c.parentSplit === splitType).length);
    }
}