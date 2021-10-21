import { TreeNode } from "./treeNode";

export class Tab {
    constructor() { }

    public panes: TreeNode[] = [new TreeNode()];
    public title?: string;
}