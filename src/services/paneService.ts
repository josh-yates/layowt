import type { SplitType } from '../models/splitType';
import { TreeNode } from '../models/treeNode';
import { TreeNodeService } from './treeNodeService';

export class PaneService {
    private readonly _nodes: TreeNode[];

    constructor() {
        this._nodes = [
            new TreeNode()
        ];
    }

    public get panes(): TreeNode[] {
        return this._nodes.filter(n => !n.child1 && !n.child2);
    }

    public splitPane(pane: TreeNode, type: SplitType): void {
        const newNodes = TreeNodeService.split(pane, type);
        this._nodes.push(...newNodes);
    }

    public closePane(pane: TreeNode): void {
        TreeNodeService.remove(pane);

        const index = this._nodes.indexOf(pane);
        if (index > -1) {
            this._nodes.splice(index, 1);
        }
    }
}