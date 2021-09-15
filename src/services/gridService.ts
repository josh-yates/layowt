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
        return this.getSpanInternal(node, null, splitType);
    }

    private getSpanInternal(node: TreeNode, checkUpToChild: TreeNode, splitType: SplitType): number {
        const parentSpan = node.parent ? this.getSpanInternal(node.parent, node, splitType) :
            (splitType === SplitType.Horizontal ? this.getGridRows() : this.getGridColumns());

        const childrenToCheck = checkUpToChild ? node.children.slice(0, node.children.indexOf(checkUpToChild) + 1) : node.children;

        const childrenWithSplit = childrenToCheck.filter(n => n.parentSplit === splitType);

        return parentSpan / Math.pow(2, childrenWithSplit.length);
    }
}