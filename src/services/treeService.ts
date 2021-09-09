import type { SplitType } from "../models/splitType";
import type { TreeNode } from "../models/treeNode";
import type { TreeNodeStore } from "./treeNodeStore";

export class TreeService {
    constructor(private readonly _treeNodeStore: TreeNodeStore) { }

    public getStepsTo(node: TreeNode, split: SplitType): number {
        if (!node.parent) return 0;

        return this.getStepsTo(node.parent, split) + (node.parentSplit === split ? node.parent.children.filter(n => n.parentSplit === split).indexOf(node) + 1 : 0);
    }
}