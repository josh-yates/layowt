import { SplitType } from '../models/splitType';
import type { TreeNode } from '../models/treeNode';
import type { TreeNodeStore } from './treeNodeStore';

export class GridService {
    constructor(
        private readonly _treeNodeStore: TreeNodeStore) { }

    public getGridColumns(): number {
        const mostVerticalSteps = Math.max(...this._treeNodeStore.nodes.map(n => this._treeNodeStore.getStepsTo(n, SplitType.Vertical)));
        return Math.pow(2, mostVerticalSteps);
    }

    public getGridRows(): number {
        const mostHorizontalSteps = Math.max(...this._treeNodeStore.nodes.map(n => this._treeNodeStore.getStepsTo(n, SplitType.Horizontal)));
        return Math.pow(2, mostHorizontalSteps);
    }

    public getIndex(node: TreeNode, splitType: SplitType): number {
        return 0;
    }

    public getSpan(node: TreeNode, splitType: SplitType): number {
        const colsOrRowCount = splitType === SplitType.Horizontal ? this.getGridRows() : this.getGridColumns();
        const stepsTo = this._treeNodeStore.getStepsTo(node, splitType);
        const childrenWithSplit = node.children.filter(c => c.parentSplit === splitType).length;
        const priorSibilingsWithSplit = this._treeNodeStore.getPriorSiblings(node, splitType).length;
        return colsOrRowCount / Math.pow(2, stepsTo + childrenWithSplit + priorSibilingsWithSplit);
    }
}