import type { SplitType } from '../models/splitType';
import type { TreeNode } from '../models/treeNode';
import type { TreeNodeStore } from './treeNodeStore';

export class GridService {
    constructor(private readonly _treeNodeStore: TreeNodeStore) { }

    public get gridColumns(): number {
        return Math.pow(2, this._treeNodeStore.nodes.sort((a, b) => b.rightDepth - a.rightDepth)[0].rightDepth);
    }

    public get gridRows(): number {
        return Math.pow(2, this._treeNodeStore.nodes.sort((a, b) => b.downDepth - a.downDepth)[0].downDepth);
    }

    public getIndex(node: TreeNode, splitType: SplitType): number {
        return 0;
    }
}